import { Component, OnInit, ViewChild } from '@angular/core';
import { IDataOptions, IDataSet, PivotView } from '@syncfusion/ej2-angular-pivotview';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartComponent} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-snopdetails',
  templateUrl: './snopdetails.component.html',
  styleUrls: ['./snopdetails.component.scss']
})



export class SnopdetailsComponent implements OnInit {

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
  
  // Chart Variables
  public primaryXAxis: any;
  public marker: Object = { visible: true, height: 10, width: 10 };
  public tooltip: Object = { enable: true };

  @ViewChild('Dialog')
  public Dialog: DialogComponent;
  public header: string = 'Prévision Statistique';
  public showCloseIcon: Boolean = true;
  public width: string = '1200';
  public height: string = '70%';
  public target: string = '.control-section';
  public openGraph = (): void => {
    this.Dialog.show();
  };

  @ViewChild('chart')
  public chart: ChartComponent;
  public title: string = 'Sales Comparision';
  public refreshdata(): void {
    this.chart.series[0].dataSource = []
    this.chart.refresh();
  }
  
  ngOnInit() {
    this.pivotData = [
      // { 'ID': 31, 'Amount': 52, 'Article': 'MOTEUR DIESEL 170F', 'TypeParams': 'Prévision', 'Year': '2019', 'Month': 'Mois 01', 'Semaine': 'Semaine 1' },
    ];

    this.primaryXAxis = {valueType: 'Category'};
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
  }









}
