import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'


@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.scss']
})
export class DetectionComponent implements OnInit {

  constructor(private http: HttpClient) { }

  httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }
  
  public initialPage: Object;
    public data: Object[];
    public pageSettings: PageSettingsModel;

    @ViewChild('grid')
    public grid: GridComponent;

    getdata(id){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
       this.http.post<any>('https://8000-aqua-silverfish-gv5meqbl.ws-eu16.gitpod.io/api/biaisFamille?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {

       this.data = data.data
       this.totalItems = data.total
       this.lastPage = Math.round(data.total/data.per_page )
       console.log(this.data)
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

  dateDebut = '2021-01-01'
  dateFin = '2021-06-30'
  
   //Pagination Variables here
   totalItems= 0
   lastPage= 0
   currentPage = 1
   pagecount = 4
   pagesize = 1

   //Modal Variables
   @ViewChild('articlesBiais')
  public articlesBiais: DialogComponent;
  public header: string = '';
  public showCloseIcon: Boolean = true;
  public width: string = '85%';
  public height: string = '75%';
  public target: string = '.control-section';
  articlesData: any
  familleName: any
  
   public showFamilleArticles = (famille): void => {
      this.familleName = famille
      this.header = 'Détails : '+famille
      this.getarticlesdata(1)
      this.articlesBiais.show();
  }


  ngOnInit(): void {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 

      this.initialPage = { pageSizes: true, pageCount: 4 };
    // this.pageSettings = { pageCount: this.pagecount,pageSize: this.pagesize,currentPage: this.currentpage };
    this.getdata(1)
  }

  filter(){
    console.log(this.dateDebut,this.dateFin)
    this.getdata(1)
  }
   getarticlesdata(id){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('famille',this.familleName);
       this.http.post<any>('https://8000-aqua-silverfish-gv5meqbl.ws-eu16.gitpod.io/api/biais?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {

       this.articlesData = data.data
       // this.totalItems = data.total
       // this.lastPage = Math.round(data.total/data.per_page )
       // console.log(this.data)
       console.log(this.articlesData)
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }



  biais(commande_g,previsions){
      var demandes = []
      var periode = this.getMonths()
      periode = Math.round(periode)
      var mois = 0
      var EcartTotal = 0
      if(previsions){
        for(var i=0;i<previsions.length;i++){
          demandes.push(0)
        }
      }
      
      if(commande_g.length>0){
        for(var i =0;i<commande_g.length;i++){
           var ind = commande_g[i].Mois -1
          demandes[ind] = commande_g[i].Sumventes
        }
        for(var i =0;i<previsions.length;i++){
          mois = i+1
          var dif = parseFloat(demandes[i])-parseFloat(previsions[i].Sumprevision)
          EcartTotal = EcartTotal + dif
        }
        return EcartTotal.toFixed(2)


      }else{
        return NaN
      }
      
  }

  rangeDateMad = []
getrangeDateBiais(){
  var firstDate
  this.rangeDateMad = []
  if(this.dateDebut){
    firstDate = this.dateDebut
    var d = new Date(firstDate)
    if(d.getMonth()<=4){
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12){
          o = o-12
          this.rangeDateMad.push(o)
        }else if(o>24){
          o = o-24
          this.rangeDateMad.push(o)
        }else{
          this.rangeDateMad.push(o)
        }
      }
   }else{
      var p = d.getMonth()
      for(var i=0;i<11;i++){
        var o = p+8+i
        if(o>12 && o<=24){
          o = o-12
          this.rangeDateMad.push(o)
        }else if(o>24){
          o = o-24
          this.rangeDateMad.push(o)
        }else{
          this.rangeDateMad.push(o)
        }
      }
    }   
  }
  // console.log('la liste des mois est : ',this.rangeDateMad)
  return this.rangeDateMad
}

  familleBiaisData: any
  dmdSum: any
  calculateFamilleBiais(demandes,previsions){
    this.familleBiaisData = []
    var prevision = previsions
    var per = this.getMonths()
    var listeMois = this.getrangeDateBiais()
    var f = listeMois.slice(5)
    var dmd =[]

     console.log('les demanes btute : ',demandes)
    for(var i =0;i<per;i++){
      var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].Mois && Year === prevision[i].Year)
      console.log('kik ',demande)
      if(demande.length>0){
        dmd.push(parseFloat(demande[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }

    console.log('voici la liste des demandes : ',dmd)
    console.log('voici la liste des previsions :',prevision)

    var sumPrev =0 
    var sumDmd = 0

    for(var i =0;i<dmd.length;i++){
      sumDmd = sumDmd + dmd[i]
      sumPrev = sumPrev + parseFloat(prevision[i].Sumprevision)
    }
    this.dmdSum = sumDmd
    var biais = sumDmd-sumPrev
    return biais.toFixed(2)

  }
  dmdSumarticle: any
  calculateArticleBiais(demandes,previsions){
    this.familleBiaisData = []
    var prevision = previsions
    var per = this.getMonths()
    var listeMois = this.getrangeDateBiais()
    var f = listeMois.slice(5)
    var dmd =[]

     console.log('les demanes btute : ',demandes)
    for(var i =0;i<per;i++){
      var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].mois && Year === prevision[i].Year)
      console.log('kik ',demande)
      if(demande.length>0){
        dmd.push(parseFloat(demande[0].Sumventes))
      }else{
        dmd.push(0)
      }
    }

    console.log('voici la liste des demandes : ',dmd)
    console.log('voici la liste des previsions :',prevision)

    var sumPrev =0 
    var sumDmd = 0

    for(var i =0;i<dmd.length;i++){
      sumDmd = sumDmd + dmd[i]
      sumPrev = sumPrev + parseFloat(prevision[i].Sumprevision)
    }
    this.dmdSumarticle = sumDmd
    var biais = sumDmd-sumPrev
    return biais.toFixed(2)

  }
  

  calculateBiaisPercent(demandes,previsions){
    if(previsions.length>0){
        var biais: any = this.calculateFamilleBiais(demandes,previsions)
        var sum = this.dmdSum
        var percent = 100*biais/sum
        return percent.toFixed(2)+' %'
      }else{
        return NaN
      }
      
  }
  calculateBiaisArticlePercent(demandes,previsions){
    if(previsions.length>0){
        var biais: any = this.calculateArticleBiais(demandes,previsions)
        var sum = this.dmdSumarticle
        var percent = 100*biais/sum
        return percent.toFixed(2)+' %'
      }else{
        return NaN
      }
      
  }

  biaispercent(demandes,previsions){
    if(previsions.length>0){
        var biais: any = this.biais(demandes,previsions)
        var sum = 0
        for(var i =0;i<demandes.length;i++){
          var sum = sum + parseFloat(demandes[i].Sumventes)
        }
        var percent = 100*biais/sum
        return percent.toFixed(2)+' %'
      }else{
        return NaN
      }
      
  }

  calculateBiaisPositive(demandes,previsions){
    if(previsions.length>0){
      var prevision = previsions
      var per = this.getMonths()
      var listeMois = this.getrangeDateBiais()
      var f = listeMois.slice(5)
      var dmd =[]

      for(var i =0;i<per;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].Mois && Year === prevision[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }

      var bPos = 0
      for(var i =0;i<prevision.length;i++){
          var dif = dmd[i]-parseFloat(previsions[i].Sumprevision)
          if (dif>=0){
            bPos = bPos + 1
          }  
      }
    return (100*bPos/per).toFixed(2)+' %';
    }else{
      return NaN
    }
      
  }
  calculateBiaisArticlePositive(demandes,previsions){
    if(previsions.length>0){
      var prevision = previsions
      var per = this.getMonths()
      var listeMois = this.getrangeDateBiais()
      var f = listeMois.slice(5)
      var dmd =[]

      for(var i =0;i<per;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].mois && Year === prevision[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }

      var bPos = 0
      for(var i =0;i<prevision.length;i++){
          var dif = dmd[i]-parseFloat(previsions[i].Sumprevision)
          if (dif>=0){
            bPos = bPos + 1
          }  
      }
    return (100*bPos/per).toFixed(2)+' %';
    }else{
      return NaN
    }
      
  }






  biaisPositive(commande_g,previsions){
      var demandes = []
      var periode = this.getMonths()
      periode = Math.round(periode)
      var mois = 0
      var bPos = 0
      if(previsions.length>0){
        for(var i =0;i<periode;i++){
          mois = i+1
          if(commande_g[i] && commande_g[i].Mois == previsions[i].Mois){
            demandes.push(commande_g[i].Sumventes)

          }else if(commande_g[i] && commande_g[i].Mois == previsions[i+1].Mois){
              demandes.push(0)
              demandes.push(commande_g[i].Sumventes)
          }
        }
          for(var i =0;i<periode;i++){
            mois = i+1
              var dif = parseFloat(demandes[i])-parseFloat(previsions[i].Sumprevision)
              if (dif>=0){
                bPos = bPos + 1
              }
            
          }
        
        
        return (100*bPos/periode).toFixed(2)+' %';

      }else{
        return NaN;
      }
      
  }





  
    


  getMonths(){
      var date1 = new Date(this.dateDebut);
      var date2 = new Date(this.dateFin);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference = Difference_In_Time / (1000 * 3600 * 24*30);
      return Math.round(Difference)
  }
  
//Pagination Functions here
checkFirstpage(){
  if(this.currentPage == 1){
    return true
  }else{
    return false
  }
}
checkLastpage(){
if(this.currentPage == this.lastPage){
  return true
}else{
  return false
}
}
nextPage(){
if(this.currentPage<this.lastPage){
  this.currentPage = this.currentPage+1
  this.getdata(this.currentPage)
}  
}
prevPage(){
if(this.currentPage>1){
  this.currentPage = this.currentPage-1
  this.getdata(this.currentPage)
}  
}
golastPage(){
this.currentPage = this.lastPage
this.getdata(this.lastPage)
}
gofirstPage(){
this.currentPage = 1
this.getdata(1)
}

}
