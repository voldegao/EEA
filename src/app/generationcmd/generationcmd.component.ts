import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-generationcmd',
  templateUrl: './generationcmd.component.html',
  styleUrls: ['./generationcmd.component.scss']
})



export class GenerationcmdComponent implements OnInit {

  public pivotData: IDataSet[];
  public dataSourceSettings: IDataOptions;

  
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('ESP_access_token')
    })
  }
  @ViewChild('pivotview')
  public pivotview: PivotView;

  constructor(private http: HttpClient) { }
  

  width: any
  ngOnInit() {
    this.pivotData = [
      // { 'ID': 31, 'Amount': 52, 'Article': 'MOTEUR DIESEL 170F', 'TypeParams': 'Prévision', 'Year': '2019', 'Month': 'Mois 01', 'Semaine': 'Semaine 1' },
    ];

    this.getFamilleListe()


    this.dataSourceSettings = {
      dataSource: this.pivotData,
      expandAll: false,
      // columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      columns: [{name:'Year'},{ name: 'Month', caption: 'Production Year' }, { name: 'Semaine' }],
      values: [{ name: 'Amount', caption: 'Sold Amount' }],
      rows: [{ name: 'Article' }, { name: 'TypeParams' }],
      showGrandTotals: false,
      showSubTotals: false
    };
    this.width = '1300'
    this.getDates()
    this.testWeek()
    this.getGenerationData()
    console.log(this.generationData)

  }
  leftBar = true
  familleFilterContainer = false
  articleFilterContainer = false
  generationData: any = ''
  prevDateRange: any
  weekDateRange: any
  datePrevDebut: any = ''
  datePrevFin: any = ''
  dateStockDebut: any = ''
  dateStockFin: any = ''
  dateCmdDebut: any = ''
  dateCmdFin: any = ''
  articleCode: any = ''
  articleName: any = ''
  familleName: any = ''
  articleText: any = ''


  showFamilleFilter(){
    this.leftBar = false;
    this.familleFilterContainer = true
  }
  showArticleFilter(){
    this.leftBar = false;
    this.articleFilterContainer = true
  }
  showLeftBar(){
    this.leftBar = true;
    this.familleFilterContainer = false
    this.articleFilterContainer = false
  }

  csvexport(){
    this.pivotview.csvExport();
    console.log('loooool')
  }

  showArticleList(){
    var listOFArticle = this.newData.filter(({Article,ID})=>ID.includes(this.articleText) || Article.includes(this.articleText))
    console.log('la lste filtre ',listOFArticle)
    this.pivotview.dataSourceSettings.dataSource = listOFArticle;
  }








  //GENERATION DES Dates de Filtres
  getWeekNumber(d){
    var target: any = new Date(d)
     var dayNr   = (target.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() != 4) {
          target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      return 1 + Math.ceil((firstThursday - target) / 604800000);
  }

  testWeek(){
    var f = this.datePrevDebut
    var l = this.datePrevFin
    var k = new Date(this.datePrevDebut)
    var s = new Date(this.datePrevFin)
    var fWeek = this.getWeekNumber(f)
    var lWeek = this.getWeekNumber(l)
    var diff =(s.getTime() - k.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    console.log('nombre de semaine : ',Math.abs(Math.round(diff)))
    console.log('f est : '+fWeek+' et l est : '+lWeek)
  }




  getweekList(){
    var f = this.datePrevDebut
    var l = this.datePrevFin
    var k = new Date(this.datePrevDebut)
    var s = new Date(this.datePrevFin)
    var fWeek = this.getWeekNumber(f)
    var lWeek = this.getWeekNumber(l)
    var firstMonth = k.getMonth()
    var janWeek
    if(firstMonth>0){
      var nextYear = k.getFullYear()+1
      janWeek = this.getWeekNumber(nextYear+'-01-01')
    }
    var diff =(s.getTime() - k.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    var weekCount = Math.abs(Math.round(diff))
    console.log('nombre de semaine : ',Math.abs(Math.round(diff)))
    console.log('f est : '+fWeek+' et l est : '+lWeek)
    console.log('le 1er du mois de janvier : la semaine est :: ',janWeek)
    var middleWeek
    if(janWeek == 1){
      middleWeek = 52
    }else{
      middleWeek = janWeek
    }
    var weekList = []
    for(var i = 0;i<=(middleWeek-fWeek);i++){
        weekList.push(fWeek+i)
    }
    for(var i = 1;i<=(lWeek);i++){
      weekList.push(i)
    }
    console.log('la liste des nombre des semaine ',weekList)
    return weekList
  }

 


getDiv(y,x) {
    var l = []
    for(var i = 0;i<x;i++){
      if(i<3){
        l.push(Math.floor(y/x))
      }else{
        l.push(Math.floor(y/x)+(y%x))
      }
    }
    return l
  }



  getDates() {
  var d= new Date('2021-08-12');
    var d = new Date();
    var fin = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    var lstDayofMonth = fin.getDate()

    this.prevDateRange = []

    this.dateCmdDebut = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'
    this.dateCmdFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    this.dateStockDebut = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'
    this.dateStockFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    this.datePrevDebut = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'

    var lstPrevMonth = d.getMonth() + 12
    if (lstPrevMonth > 12) {
      var findate = new Date((d.getFullYear() + 1), (lstPrevMonth - 12), 0);
      var lstDayofMonthPrev = findate.getDate()
      this.datePrevFin = (d.getFullYear() + 1) + '-' + (lstPrevMonth - 12) + '-' + lstDayofMonthPrev
    } else {
      this.datePrevFin = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + lstDayofMonth
    }
    for(var i =0;i<12;i++){
      var mois = d.getMonth()+1+i
      if(mois>12){
        this.prevDateRange.push(
          {year:d.getFullYear()+1,mois:mois-12}
        )
      }else{
        this.prevDateRange.push(
          {year:d.getFullYear(),mois:mois}
        )
      }
    }
  }
  //GET DATA
  getGenerationData() {
    let postData = new FormData();
    postData.append('datePrevDebut', this.datePrevDebut);
    postData.append('datePrevFin', this.datePrevFin);
    postData.append('dateStockDebut', this.dateStockDebut);
    postData.append('dateStockFin', this.dateStockFin);
    postData.append('dateCmdDebut', this.dateCmdDebut);
    postData.append('dateCmdFin', this.dateCmdFin);
    postData.append('code', this.articleCode);
    postData.append('article', this.articleName);
    postData.append('famille', this.familleName);
    this.http.post<any>('https://8000-aqua-silverfish-gv5meqbl.ws-eu16.gitpod.io/api/generation/data', postData, this.httpOptions).map(res => res).subscribe(data => {
      this.newData = []
      this.pivotview.dataSourceSettings.dataSource = this.newData;
      this.generationData = data
      console.log('ok data here ', data)
      this.loopInsideData(data)
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  FamilleListe: any
  getFamilleListe(){
    this.http.get<any>('https://8000-aqua-silverfish-gv5meqbl.ws-eu16.gitpod.io/api/params', this.httpOptions).map(res => res).subscribe(data => {
      this.FamilleListe = data.familles
    }, err => {
      console.log(JSON.stringify(err));
    });
  }

  getDataWithFamille(){
    console.log('this is famille ',this.familleName)
    this.getGenerationData()
  }
  

  transformPrevisionData(data) {
    var itemPrev = data.previsions
    var itemCmd = data.commandes
    var itemStock = data.stocks
    var infos = data
    //Prevision Part here
    if (itemPrev.length > 0 ) {
      for (var i = 0; i < itemPrev.length; i++) {
        var mois: any = 0
        var prevision
        var cmdPlanifie
        if(itemPrev[i].Mois >= 10){
           prevision = {
            'ID': infos.code,
            'Amount': itemPrev[i].prevision,
            'Article': infos.designation,
            'TypeParams': '1- Prévision',
            'Year': itemPrev[i].Year,
            'Month':  itemPrev[i].Mois + '-' + itemPrev[i].Year,
            'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            'Week':itemPrev[i].Week
          }
           cmdPlanifie = {
            'ID': infos.code,
            'Amount': 0,
            'Article': infos.designation,
            'TypeParams': '4- Commande Planifiée',
            'Year': itemPrev[i].Year,
            'Month':  itemPrev[i].Mois + '-' + itemPrev[i].Year,
            'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            'Week':itemPrev[i].Week
          }
        }else{
          if(itemPrev[i].Week == 0){
            prevision = {
              'ID': infos.code,
              'Amount': itemPrev[i].prevision,
              'Article': infos.designation,
              'TypeParams': '1- Prévision',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine 01',
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
            cmdPlanifie = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '4- Commande Planifiée',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine 01',
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
          }else if(itemPrev[i].Week < 10){
            prevision = {
              'ID': infos.code,
              'Amount': itemPrev[i].prevision,
              'Article': infos.designation,
              'TypeParams': '1- Prévision',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine 0'+ itemPrev[i].Week,
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
            cmdPlanifie = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '4- Commande Planifiée',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine 0'+ itemPrev[i].Week,
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
          }else{
            prevision = {
              'ID': infos.code,
              'Amount': itemPrev[i].prevision,
              'Article': infos.designation,
              'TypeParams': '1- Prévision',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine '+ itemPrev[i].Week,
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
            cmdPlanifie = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '4- Commande Planifiée',
              'Year': itemPrev[i].Year,
              'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
              'Semaine': 'Semaine '+ itemPrev[i].Week,
              'Mois':itemPrev[i].Mois,
              'Week':itemPrev[i].Week
            }
          }
          
        }
        
        this.newData.push(prevision)
        this.newData.push(cmdPlanifie)
        
      }
    }


    // Commande Clients part here
    if(itemCmd.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      console.log(date)
      const result = this.newData.filter(({TypeParams,Year, Month})=>TypeParams==='1- Prévision' && Year===2021  && Month ===date) 
      console.log('alrs les resu ',result)
      for(var k =0;k<result.length;k++){
        var cm = itemCmd.filter(({Week,Mois,Year})=> Week ===result[k].Week && Mois === result[k].Mois && Year === result[k].Year )
        if(cm.length > 0 ){
          console.log(cm)
          if(cm.Mois>10){
            var cmd = {
              'ID': infos.code,
              'Amount': cm[0].Sumventes,
              'Article': infos.designation,
              'TypeParams': '2- Ventes',
              'Year':  cm[0].Year,
              'Month':   cm[0].Mois + '-' +  cm[0].Year,
              'Semaine': 'Semaine '+ cm[0].Week
            }
            this.newData.push(cmd)
          }else{
            if(cm.Week < 10){
              var cmd = {
                'ID': infos.code,
                'Amount':  cm[0].Sumventes,
                'Article': infos.designation,
                'TypeParams': '2- Ventes',
                'Year':  cm[0].Year,
                'Month':  '0'+ cm[0].Mois + '-' +  cm[0].Year,
                'Semaine': 'Semaine 0'+ cm[0].Week
              }
              this.newData.push(cmd)
            }else{
              var cmd = {
                'ID': infos.code,
                'Amount':  cm[0].Sumventes,
                'Article': infos.designation,
                'TypeParams': '2- Ventes',
                'Year':  cm[0].Year,
                'Month':  '0'+ cm[0].Mois + '-' +  cm[0].Year,
                'Semaine': 'Semaine '+ cm[0].Week
              }
              this.newData.push(cmd)
            }
          }
          
        }else{
          if(result[k].Mois>10){
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '2- Ventes',
              'Year': result[k].Year,
              'Month':  result[k].Mois + '-' + result[k].Year,
              'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }else{
            if(result.Week < 10){
              var cmf: any = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '2- Ventes',
                'Year': result[k].Year,
                'Month':  '0'+result[k].Mois + '-' + result[k].Year,
                'Semaine': 'Semaine 0'+result[k].Week
              }
              this.newData.push(cmf)
            }else{
              var cmf: any = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '2- Ventes',
                'Year': result[k].Year,
                'Month':  '0'+result[k].Mois + '-' + result[k].Year,
                'Semaine': 'Semaine '+result[k].Week
              }
              this.newData.push(cmf)
            }
          }
        }
      }
    }

    //STOCK FUNCTION HERE
    if(itemStock.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      console.log(date)
      const result = this.newData.filter(({TypeParams,Year, Month})=>TypeParams==='1- Prévision' && Year===2021  && Month ===date) 
      console.log('alrs les resu ',result)
      console.log('les stocks ',itemStock)
      for(var k =0;k<result.length;k++){
        var cm = itemStock.filter(({Week,Mois,Year})=> Week ===result[k].Week && Mois === result[k].Mois && Year === result[k].Year )
        if(cm.length > 0 ){
          console.log(cm)
          if(cm.Mois>10){
            var cmd = {
              'ID': infos.code,
              'Amount': cm[0].quantite,
              'Article': infos.designation,
              'TypeParams': '5- Stock Réel',
              'Year': cm[0].Year,
              'Month':  cm[0].Mois + '-' + cm[0].Year,
              'Semaine': 'Semaine '+cm[0].Week
            }
            this.newData.push(cmd)
          }else{
            if(cm.Week < 10){
              var cmd = {
                'ID': infos.code,
                'Amount': cm[0].quantite,
                'Article': infos.designation,
                'TypeParams': '5- Stock Réel',
                'Year': cm.Year,
                'Month':  '0'+cm[0].Mois + '-' + cm[0].Year,
                'Semaine': 'Semaine 0'+cm[0].Week
              }
              this.newData.push(cmd)
            }else{
              var cmd = {
                'ID': infos.code,
                'Amount': cm[0].quantite,
                'Article': infos.designation,
                'TypeParams': '5- Stock Réel',
                'Year': cm[0].Year,
                'Month':  '0'+cm[0].Mois + '-' + cm[0].Year,
                'Semaine': 'Semaine '+cm[0].Week
              }
              this.newData.push(cmd)
            }
          }
          
        }else{
          if(result[k].Mois>10){
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '5- Stock Réel',
              'Year': result[k].Year,
              'Month':  result[k].Mois + '-' + result[k].Year,
              'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }else{
            if(result.Week < 10){
              var cmf: any = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '5- Stock Réel',
                'Year': result[k].Year,
                'Month':  '0'+result[k].Mois + '-' + result[k].Year,
                'Semaine': 'Semaine 0'+result[k].Week
              }
              this.newData.push(cmf)
            }else{
              var cmf: any = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '5- Stock Réel',
                'Year': result[k].Year,
                'Month':  '0'+result[k].Mois + '-' + result[k].Year,
                'Semaine': 'Semaine '+result[k].Week
              }
              this.newData.push(cmf)
            }
          }
        }
      }
    }
    //Fonction de la demande 
    if(itemCmd.length>0 && itemPrev.length>0){
      var previsions = this.newData.filter(({TypeParams})=>TypeParams === '1- Prévision')
      var commandes = this.newData.filter(({TypeParams})=>TypeParams === '2- Ventes')
      for(var i = 0;i<previsions.length;i++){
        if(commandes.length == 0){
          var cmf: any = {
            'ID': infos.code,
            'Amount': previsions[i].Amount,
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }else if(commandes[i]){
          var cmf: any = {
            'ID': infos.code,
            'Amount': Math.max(previsions[i].Amount,commandes[i].Amount),
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }else{
          var cmf: any = {
            'ID': infos.code,
            'Amount': previsions[i].Amount,
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }
      }
    }

    //Fonction du Besoin Net
    if(itemCmd.length>0 && itemPrev.length>0 && itemStock.length>0){
      var demandes = this.newData.filter(({TypeParams})=>TypeParams === '3- Demande')
      var stocks = this.newData.filter(({TypeParams})=>TypeParams === '5- Stock Réel')
      console.log('----///////-----')
      console.log('commandes : ',demandes)
      console.log('stocks : ',stocks)
      var stockInitial = 15
      for(var i=0;i<demandes.length;i++){
        if(i == 0){
          var besoin = stocks[i].Amount-demandes[i].Amount
          if(besoin<0){
            var bs = {
              'ID': infos.code,
              'Amount': besoin,
              'Article': infos.designation,
              'TypeParams': '6- Besoin Net',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              'Semaine': previsions[i].Semaine
            }
            this.newData.push(bs)
          }else{
            var bs = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '6- Besoin Net',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              'Semaine': previsions[i].Semaine
            }
            this.newData.push(bs)
          }
        }else{
          if(!stocks[i-1]){
              var besoin = 0-demandes[i].Amount
                var bs = {
                  'ID': infos.code,
                  'Amount': besoin,
                  'Article': infos.designation,
                  'TypeParams': '6- Besoin Net',
                  'Year': previsions[i].Year,
                  'Month':  previsions[i].Month,
                  'Semaine': previsions[i].Semaine
                }
                this.newData.push(bs)
              
          }else{
            var besoin = stocks[i-1].Amount-demandes[i].Amount
            if(besoin<0){
              var bs = {
                'ID': infos.code,
                'Amount': besoin,
                'Article': infos.designation,
                'TypeParams': '6- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                'Semaine': previsions[i].Semaine
              }
              this.newData.push(bs)
            }else{
              var bs = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '6- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                'Semaine': previsions[i].Semaine
              }
              this.newData.push(bs)
            }
          }
         
        }
      }
    }

//Deuxieme transfort






  }


  //SECOND TEST
  transformPrevisionDataMois(data) {
    var itemPrev = data.previsions_s
    var itemCmd = data.commandes_m
    var itemStock = data.stocks_m
    var infos = data
    //Prevision Part here
    if (itemPrev.length > 0 ) {
      for (var i = 0; i < itemPrev.length; i++) {
        var mois: any = 0
        var prevision
        var cmdPlanifie
        if(itemPrev[i].Mois >= 10){
           prevision = {
            'ID': infos.code,
            'Amount': itemPrev[i].Sumprev,
            'Article': infos.designation,
            'TypeParams': '1- Prévision',
            'Year': itemPrev[i].Year,
            'Month':  itemPrev[i].Mois + '-' + itemPrev[i].Year,
            // 'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            // 'Week':itemPrev[i].Week
          }
           cmdPlanifie = {
            'ID': infos.code,
            'Amount': 0,
            'Article': infos.designation,
            'TypeParams': '4- Commande Planifiée',
            'Year': itemPrev[i].Year,
            'Month':  itemPrev[i].Mois + '-' + itemPrev[i].Year,
            // 'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            // 'Week':itemPrev[i].Week
          }
        }else{
          prevision = {
            'ID': infos.code,
            'Amount': itemPrev[i].Sumprev,
            'Article': infos.designation,
            'TypeParams': '1- Prévision',
            'Year': itemPrev[i].Year,
            'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
            // 'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            // 'Week':itemPrev[i].Week
          }
          cmdPlanifie = {
            'ID': infos.code,
            'Amount': 0,
            'Article': infos.designation,
            'TypeParams': '4- Commande Planifiée',
            'Year': itemPrev[i].Year,
            'Month':  '0'+itemPrev[i].Mois + '-' + itemPrev[i].Year,
            // 'Semaine': 'Semaine '+ itemPrev[i].Week,
            'Mois':itemPrev[i].Mois,
            // 'Week':itemPrev[i].Week
          }
          
        }
        
        this.newData.push(prevision)
        this.newData.push(cmdPlanifie)
        
      }
    }


    // Commande Clients part here
    if(itemCmd.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      console.log(date)
      const result = this.newData.filter(({TypeParams,Year, Month})=>TypeParams==='1- Prévision' && Year===2021  && Month ===date) 
      console.log('alrs les resu ',result)
      for(var k =0;k<result.length;k++){
        var cm = itemCmd.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        if(cm.length > 0 ){
          console.log(cm)
          if(cm.Mois>10){
            var cmd = {
              'ID': infos.code,
              'Amount': cm[0].Sumventes,
              'Article': infos.designation,
              'TypeParams': '2- Ventes',
              'Year':  cm[0].Year,
              'Month':   cm[0].Mois + '-' +  cm[0].Year,
              // 'Semaine': 'Semaine '+ cm[0].Week
            }
            this.newData.push(cmd)
          }else{
              var cmd = {
                'ID': infos.code,
                'Amount':  cm[0].Sumventes,
                'Article': infos.designation,
                'TypeParams': '2- Ventes',
                'Year':  cm[0].Year,
                'Month':  '0'+ cm[0].Mois + '-' +  cm[0].Year,
                // 'Semaine': 'Semaine '+ cm[0].Week
              }
              this.newData.push(cmd)
            
          }
          
        }else{
          if(result[k].Mois>10){
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '2- Ventes',
              'Year': result[k].Year,
              'Month':  result[k].Mois + '-' + result[k].Year,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }else{
            var cmf: any = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '2- Ventes',
              'Year': result[k].Year,
              'Month':  '0'+result[k].Mois + '-' + result[k].Year,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }
        }
      }
    }

    //STOCK FUNCTION HERE
    if(itemStock.length>0){
      var d = new Date()
      var month = d.getMonth()+1
      var year = d.getFullYear()
      var date 
      if(month<10){
        date = '0'+month+'-'+year
      }else{
        date = month+'-'+year
      }
      console.log(date)
      const result = this.newData.filter(({TypeParams,Year, Month})=>TypeParams==='1- Prévision' && Year===2021  && Month ===date) 
      console.log('alrs les resu ',result)
      console.log('les stocks ',itemStock)
      for(var k =0;k<result.length;k++){
        var cm = itemStock.filter(({Mois,Year})=> Mois === result[k].Mois && Year === result[k].Year )
        if(cm.length > 0 ){
          console.log(cm)
          if(cm.Mois>10){
            var cmd = {
              'ID': infos.code,
              'Amount': cm[0].quantite,
              'Article': infos.designation,
              'TypeParams': '5- Stock Réel',
              'Year': cm[0].Year,
              'Month':  cm[0].Mois + '-' + cm[0].Year,
              // 'Semaine': 'Semaine '+cm[0].Week
            }
            this.newData.push(cmd)
          }else{
            var cmd = {
              'ID': infos.code,
              'Amount': cm[0].quantite,
              'Article': infos.designation,
              'TypeParams': '5- Stock Réel',
              'Year': cm[0].Year,
              'Month':  '0'+cm[0].Mois + '-' + cm[0].Year,
              // 'Semaine': 'Semaine '+cm[0].Week
            }
            this.newData.push(cmd)
          }
          
        }else{
          if(result[k].Mois>10){
            var cmf: any = {
              'ID': infos.code,
              'Amount':0,
              'Article': infos.designation,
              'TypeParams': '5- Stock Réel',
              'Year': result[k].Year,
              'Month':  result[k].Mois + '-' + result[k].Year,
              // 'Semaine': 'Semaine '+result[k].Week
            }
            this.newData.push(cmf)
          }else{
           
              var cmf: any = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '5- Stock Réel',
                'Year': result[k].Year,
                'Month':  '0'+result[k].Mois + '-' + result[k].Year,
                // 'Semaine': 'Semaine '+result[k].Week
              }
              this.newData.push(cmf)
            
          }
        }
      }
    }
    //Fonction de la demande 
    if(itemCmd.length>0 && itemPrev.length>0){
      var previsions = this.newData.filter(({TypeParams})=>TypeParams === '1- Prévision')
      var commandes = this.newData.filter(({TypeParams})=>TypeParams === '2- Ventes')
      for(var i = 0;i<previsions.length;i++){
        if(commandes.length == 0){
          var cmf: any = {
            'ID': infos.code,
            'Amount': previsions[i].Amount,
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            // 'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }else if(commandes[i]){
          var cmf: any = {
            'ID': infos.code,
            'Amount': Math.max(previsions[i].Amount,commandes[i].Amount),
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            // 'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }else{
          var cmf: any = {
            'ID': infos.code,
            'Amount': previsions[i].Amount,
            'Article': infos.designation,
            'TypeParams': '3- Demande',
            'Year': previsions[i].Year,
            'Month':  previsions[i].Month,
            // 'Semaine': previsions[i].Semaine
          }
          this.newData.push(cmf)
        }
      }
    }

    //Fonction du Besoin Net
    if(itemCmd.length>0 && itemPrev.length>0 && itemStock.length>0){
      var demandes = this.newData.filter(({TypeParams})=>TypeParams === '3- Demande')
      var stocks = this.newData.filter(({TypeParams})=>TypeParams === '5- Stock Réel')
      console.log('----///////-----')
      console.log('commandes : ',demandes)
      console.log('stocks : ',stocks)
      var stockInitial = 40
      for(var i=0;i<demandes.length;i++){
        if(i == 0){
          var besoin = stockInitial-demandes[i].Amount
          if(besoin<0){
            var bs = {
              'ID': infos.code,
              'Amount': besoin,
              'Article': infos.designation,
              'TypeParams': '6- Besoin Net',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              // 'Semaine': previsions[i].Semaine
            }
            this.newData.push(bs)
            var por = {
              'ID': infos.code,
              'Amount': Math.abs(besoin),
              'Article': infos.designation,
              'TypeParams': '7- Planned Order Receipt',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              // 'Semaine': previsions[i].Semaine
            }
            this.newData.push(por)
          }else{
            var bs = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '6- Besoin Net',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              // 'Semaine': previsions[i].Semaine
            }
            this.newData.push(bs)
            var por = {
              'ID': infos.code,
              'Amount': 0,
              'Article': infos.designation,
              'TypeParams': '7- Planned Order Receipt',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
              // 'Semaine': previsions[i].Semaine
            }
            this.newData.push(por)
          }
        }else{
          if(!stocks[i-1]){
              var besoin = 0-demandes[i].Amount
                var bs = {
                  'ID': infos.code,
                  'Amount': besoin,
                  'Article': infos.designation,
                  'TypeParams': '6- Besoin Net',
                  'Year': previsions[i].Year,
                  'Month':  previsions[i].Month,
                  // 'Semaine': previsions[i].Semaine
                }
                this.newData.push(bs)
                var por = {
                  'ID': infos.code,
                  'Amount': Math.abs(besoin),
                  'Article': infos.designation,
                  'TypeParams': '7- Planned Order Receipt',
                  'Year': previsions[i].Year,
                  'Month':  previsions[i].Month,
                  // 'Semaine': previsions[i].Semaine
                }
                this.newData.push(por)
              
          }else{
            var besoin = stocks[i-1].Amount-demandes[i].Amount
            if(besoin<0){
              var bs = {
                'ID': infos.code,
                'Amount': besoin,
                'Article': infos.designation,
                'TypeParams': '6- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                // 'Semaine': previsions[i].Semaine
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': Math.abs(besoin),
                'Article': infos.designation,
                'TypeParams': '7- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                // 'Semaine': previsions[i].Semaine
              }
              this.newData.push(por)
            }else{
              var bs = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '6- Besoin Net',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                // 'Semaine': previsions[i].Semaine
              }
              this.newData.push(bs)
              var por = {
                'ID': infos.code,
                'Amount': 0,
                'Article': infos.designation,
                'TypeParams': '7- Planned Order Receipt',
                'Year': previsions[i].Year,
                'Month':  previsions[i].Month,
                // 'Semaine': previsions[i].Semaine
              }
              this.newData.push(por)
            }
          }
         
        }
      }
      //Planner Order Realease
      var pors = this.newData.filter(({TypeParams})=>TypeParams==='7- Planned Order Receipt')
      if(pors.length>0){
        for(var i = 0;i<pors.length-2;i++){
          if(pors[i+2].Amount != 0){
            var por2 = {
              'ID': infos.code,
              'Amount': pors[i+2].Amount,
              'Article': infos.designation,
              'TypeParams': '8- Planner Order Release',
              'Year': previsions[i].Year,
              'Month':  previsions[i].Month,
            } 
            this.newData.push(por2)
          }
         
        }
      }
    }

    
  }


  newData: any = []
  loopInsideData(data) {
    this.newData = []
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        this.transformPrevisionDataMois(data[i])
      }
      this.pivotview.dataSourceSettings.dataSource = this.newData;
    }
  }




  // transformPrevisionData(data) {
  //   var itemPrev = data.previsions
  //   var itemCmd = data.commandes
  //   var infos = data
  //   //Prevision Part here
  //   if (itemPrev.length > 0) {
  //     for (var i = 0; i < itemPrev.length; i++) {
  //       var mois: any = 0
  //       if (itemPrev[i].Mois < 10) {
  //         mois = '0' + itemPrev[i].Mois
  //       } else {
  //         mois = itemPrev[i].Mois
  //       }
  //       for (var k = 1; k <= 4; k++) {
  //         var prevision = {
  //           'ID': infos.code,
  //           'Amount': itemPrev[i].prevision / 4,
  //           'Article': infos.designation,
  //           'TypeParams': '1-Prévision',
  //           'Year': itemPrev[i].Year,
  //           'Month': mois + '-' + itemPrev[i].Year,
  //           'Semaine': 'Semaine '+k
  //         }
  //         this.newData.push(prevision)
  //       }
        
  //     }
  //   }else{
  //     for (var i = 0; i < this.prevDateRange.length; i++) {
  //         var mois: any = 0
  //         if (this.prevDateRange[i].mois < 10) {
  //           mois = '0' + this.prevDateRange[i].mois
  //         } else {
  //           mois = this.prevDateRange[i].mois
  //         }
  //       for (var k = 1; k <= 4; k++) {
  //         var previsiond = {
  //           'ID': infos.code,
  //           'Amount': 0,
  //           'Article': infos.designation,
  //           'TypeParams': '1-Prévision',
  //           'Year': this.prevDateRange[i].year,
  //           'Month': mois + '-' + this.prevDateRange[i].year,
  //           'Semaine': 'Semaine '+k
  //         }
  //         this.newData.push(previsiond)
  //       }

  //     }
  //   }

  //   //Commande Clients part here
  //   if (itemCmd.length > 0) {
  //     for (var i = 0; i < itemCmd.length; i++) {
  //       var mois: any = 0
  //       if (itemCmd[i].Mois < 10) {
  //         mois = '0' + itemCmd[i].Mois
  //       } else {
  //         mois = itemCmd[i].Mois
  //       }
  //       for (var k = 1; k <= 4; k++) {
  //         var cmd = {
  //           'ID': infos.code,
  //           'Amount': itemCmd[i].Sumventes,
  //           'Article': infos.designation,
  //           'TypeParams': '2-Commande Client',
  //           'Year': itemCmd[i].Year,
  //           'Month': mois + '-' + itemCmd[i].Year,
  //           'Semaine': 'Semaine '+itemCmd[i].Week
  //         }
  //         this.newData.push(cmd)
  //       }
        
  //     }
  //   }else{
  //       for (var i = 0; i < this.prevDateRange.length; i++) {
  //         var mois: any = 0
  //         if (this.prevDateRange[i].mois < 10) {
  //           mois = '0' + this.prevDateRange[i].mois
  //         } else {
  //           mois = this.prevDateRange[i].mois
  //         }
  //       for (var k = 1; k <= 4; k++) {
  //         var cmdd = {
  //           'ID': infos.code,
  //           'Amount': 0,
  //           'Article': infos.designation,
  //           'TypeParams': '2-Commande Client',
  //           'Year': this.prevDateRange[i].year,
  //           'Month': mois + '-' + this.prevDateRange[i].year,
  //           'Semaine': 'Semaine '+k
  //         }
  //         this.newData.push(cmdd)
  //       }

  //     }
  //   }

  // }

}
