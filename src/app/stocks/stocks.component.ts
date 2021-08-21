import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';

import { PageEventArgs, PageService } from '@syncfusion/ej2-angular-grids'


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
 constructor(private http: HttpClient) { }

  httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
      })
  }
   public initialPage: Object;

     @ViewChild('chartm')
    public chartm: ChartComponent;
    public title: string = 'Niveaux de Stock';
   

  public chartData: any;
  public marker: Object = {visible: true,height: 10,width: 10};
  public tooltip: Object = {enable: true};


  ngOnInit(): void {
    if (!window.localStorage.getItem('logged')) {
      window.location.href = "#/login";
    } 

     this.initialPage = { pageSizes: true, pageCount: 4 };
    this.getTaux()
    this.getdata(1)

    this.chartData = []
    this.primaryXAxis = {valueType: 'Category'};

  }
    @ViewChild('grid')
    public grid: GridComponent;

    params: any
    data: any
     //Pagination Variables here
   totalItems= 0
   lastPage= 0
   currentPage = 1
   pagecount = 4
   pagesize = 1
     dateDebut = '2021-01-01'
  dateFin = '2021-06-30'
 public primaryXAxis: any;
  
  //Modal Variables
   @ViewChild('articlesBiais')
  public articlesBiais: DialogComponent;
  public header: string = 'Coefficient de variation';
  public showCloseIcon: Boolean = true;
  public width: string = '85%';
  public height: string = '75%';
  public target: string = '.control-section';
  articlesData: any
  familleName: any 

  @ViewChild('articlesBiaisgraph')
  public articlesBiaisgraph: DialogComponent;
  public headerg: string = '';
  // public showCloseIcon: Boolean = true;
  // public width: string = '85%';
  // public height: string = '75%';
  // public target: string = '.control-section';

  
  public showFamilleArticles = (famille): void => {
      this.familleName = famille
      this.getarticlesdata(1)
      this.articlesBiais.show();
      this.header = "Famille : "+famille
  }

 public showgraphArticle = (code): void => {
      // this.familleName = famille
      // this.getarticlesdata(1)
      this.articleCodeID = code
      this.headerg = 'Article Code : '+code
      this.articlesBiaisgraph.show();
      // this.header = "Famille : "+famille
      console.log("this is tht code ",code)
    
      this.getdataArticleDetails()
      this.getdatagraph(code)

  }


  filter(){
    console.log(this.dateDebut,this.dateFin)
    this.getdata(1)
  }

  dataGraph: any
  periode = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novenmbre','Décembre']
  getdatagraph(code){
      this.chartData = []
      this.chartm.series[0].dataSource = this.chartData
      this.chartm.refresh();
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('code',code);
       this.http.post<any>('https://8000-red-wren-9e2b6qxh.ws-eu16.gitpod.io/api/stocks?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
       var periodiqueData = data.data
       
       var mrange = this.getMonthrange(periodiqueData)
       console.log('voici mRange',mrange)
       console.log('voici datagraph',this.dataGraph)
       for(var i=0;i<mrange.length;i++){
        this.chartData.push({month:mrange[i],stock:this.dataGraph[i]})
       }
        this.chartm.series[0].dataSource = this.chartData
        this.chartm.refresh();
        console.log('thisis chart data : ',this.chartData)
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

    getdata(id){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
       this.http.post<any>('https://8000-red-wren-9e2b6qxh.ws-eu16.gitpod.io/api/biaisFamille?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {

       this.data = data.data
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

   getTaux(){
       this.http.get<any>('https://8000-red-wren-9e2b6qxh.ws-eu16.gitpod.io/api/params', this.httpOptions).map(res => res).subscribe(data => {
       this.params = data.taux
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

   taux(id){
    return this.params[id-1].taux
   } 
   facteur(id){
    return this.params[id-1].facteur_z
   } 

  getarticlesdata(id){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebut);
      postData.append('dateFin',this.dateFin);
      postData.append('famille',this.familleName);
       this.http.post<any>('https://8000-red-wren-9e2b6qxh.ws-eu16.gitpod.io/api/biais?page='+id, postData, this.httpOptions).map(res => res).subscribe(data => {

       this.articlesData = data.data
       // this.totalItems = data.total
       // this.lastPage = Math.round(data.total/data.per_page )
       // console.log(this.data)
       console.log(this.articlesData)
       
      }, err => {
        console.log(JSON.stringify(err));
      });
    }

 

  mad(commande_g,previsions){
    var demandes = []
    var periode = this.getMonths()
    periode = Math.round(periode)
    var mois = 0
    var EcartTotal = 0
    var ecarts = 0
    for(var i=0;i<previsions.length;i++){
      demandes.push(0)
    }

    if(commande_g.length>0){
      for(var i =0;i<commande_g.length;i++){
        var ind = commande_g[i].Mois -1
        demandes[ind] = commande_g[i].Sumventes
      }
      for(var i =0;i<previsions.length;i++){
        mois = i+1
        ecarts = ecarts + Math.abs(parseFloat(demandes[i])-parseFloat(previsions[i].Sumprevision))
        
      }
      return (ecarts/previsions.length).toFixed(2);  


    }else{
      return NaN
    }
    
}


 dateDebutGraph(){
      var firstDate
      firstDate = this.dateDebut
      var d = new Date(firstDate)
      if(d.getMonth()<=4){
        console.log('voici la liste range des date :',(d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1)
        return (d.getFullYear()-1) + "-" + (d.getMonth()+8) + "-" + 1
      }else{
        console.log(d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1)
        return d.getFullYear() + "-" + (d.getMonth() - 4) + "-" + 1
      }   
    }


articleDataDetail: any
    articleTS: any
    articleCodeID: any
    getdataArticleDetails(){
      let postData = new FormData();
      postData.append('dateDebut', this.dateDebutGraph());
      postData.append('dateFin',this.dateFin);
      postData.append('code',this.articleCodeID);
       this.http.post<any>('https://8000-red-wren-9e2b6qxh.ws-eu16.gitpod.io/api/mad?page=1', postData, this.httpOptions).map(res => res).subscribe(data => {
     
       this.articleDataDetail= data.data[0];
      //  this.articleTS = this.tracksignal(this.articleDataDetail.commande_d,this.articleDataDetail.previsions)
      //  this.getdataForCharta()
       this.CalculateDataArticle()
      }, err => {
        console.log(JSON.stringify(err));
      });
    }


  rangeDateMad = []
    getrangeDateMad(){
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
      console.log('la liste des mois est : ',this.rangeDateMad)
      return this.rangeDateMad
    }

 dataTableArticleDetails: any
    CalculateDataArticle(){
      var range = this.rangeDateMad;
      var demandes = this.articleDataDetail.commande_c
      var prevision = this.articleDataDetail.previsions_c
      console.log('loool previsions : ',prevision)
      var dmd = []
      this.getrangeDateMad() // pour 
      var dateslice = []
      dateslice = this.getrangeDateMad()
      console.log('date slice : ',dateslice.slice(5))
      var f = dateslice.slice(5)
      var data = []
      var periode = []
     
      for(var i =0;i<prevision.length;i++){
        var demande = demandes.filter(({Mois,Year})=>Mois===prevision[i].mois && Year===prevision[i].Year)
        if(demande.length>0){
          dmd.push(parseFloat(demande[0].Sumventes))
        }else{
          dmd.push(0)
        }
      }
      console.log('voici la liste des demandes : ',dmd)
      console.log('voici la liste des previsions : ',prevision)

      var madFinal = []
      for(var i=0;i<6;i++){
        var madMois = 0
        var abs = 0
        for(var k=i;k<6+i;k++){
          console.log('Prevvvvv : ',prevision[k].Sumprevision)
          abs = abs + Math.abs(dmd[k]-parseFloat(prevision[k].Sumprevision))
        }
        madMois = abs/6
        madFinal.push(madMois)
      }
      for(var i =0;i<6;i++){
        var o = f[i]-1
        periode.push(this.periode[o])
        var tracking = (dmd[5+i]- parseFloat(prevision[5+i].Sumprevision))/madFinal[i] 
        data.push({
          periode:this.periode[o],
          mad:madFinal[i].toFixed(2)

        })
      }
      console.log('et voici a liste des mois : ',periode)
      console.log('data here : ',data)
      console.log('voici la liste des MAD : ',madFinal)
      this.dataTableArticleDetails = data
      console.log('le pro de games : ',this.dataTableArticleDetails)
      this.CaculateDataSetArticleChart()

    }

    chartDatalol = []
    CaculateDataSetArticleChart(){
      this.chartDatalol = []
     this.chartm.series[0].dataSource = []
     this.chartm.series[1].dataSource = this.chartDatalol
      this.chartm.refresh();
      for(var i = 0;i<6;i++){
         var facteur: any = this.facteur(this.articleDataDetail.tauxsecurite_id)
         var mad = this.dataTableArticleDetails[i].mad
          var res = mad*facteur

        this.chartDatalol.push({month:this.dataTableArticleDetails[i].periode,stocksecurity:Math.round(res)})

    }
    console.log('chartloool ',this.chartDatalol)
    this.chartm.series[1].dataSource = this.chartDatalol
      this.chartm.refresh();
    


}


stockSecurity(x,y,id){
  var mad: any = this.mad(x,y)
  var facteur: any = this.facteur(id)
  var res = mad*facteur
  return res.toFixed(2)
}
  



monthRange: any

getMonthrange(data){
  this.monthRange = []
  this.dataGraph = []
  var months = this.getMonths()
  var firstDate = this.dateDebut
  var d = new Date(firstDate)
  var firstMonth = d.getMonth()

  for(var i=0;i<months;i++){
    var m = firstMonth+i
    if(m>11){
      m = m-12
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }
    }else if(m>23){
      m = m-24
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }
    }else{
      this.monthRange.push(this.periode[m])
      var s = data.filter(({Mois})=>Mois === m+1)
      if(s.length>0){
        this.dataGraph.push(s[0].quantite)
      }
    }
  }

  return this.monthRange
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
