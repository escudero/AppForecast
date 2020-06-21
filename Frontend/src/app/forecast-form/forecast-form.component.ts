import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as Handsontable from 'handsontable';

import { ForecastService } from './../forecast.service';


@Component({
  selector: 'app-forecast-form',
  templateUrl: './forecast-form.component.html',
  styleUrls: ['./forecast-form.component.scss']
})
export class ForecastFormComponent implements OnInit {

  public forecastForm: FormGroup;

  public dataset: any[] = [];

  public hotSettings = {
    minRows: 10,
    colHeaders: true,
    rowHeaders: true,
    minSpareRows: 1,
    stretchH: 'all'
  };
 
  public models: any[] = [
    {value: 'autoarima_python', viewValue: 'auto-ARIMA'},
    {value: 'prophet_python', viewValue: 'Prophet'}
  ];


  public lineChartData: ChartDataSets[] = [
    { label: 'Previous', fill: false, data: [] },
    { label: 'Forecast', fill: false, data: [] },
    { label: 'Upper',    fill: '+1',  data: [] },
    { label: 'Lower',    fill: 2,     data: [] }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    tooltips: {
      mode: 'index'
    }
  };
  public lineChartColors:Color[] = [
    {
      backgroundColor: '#0072b2c2',
      borderColor: '#0490de',
      pointBackgroundColor: '0072b2c2',
      pointBorderColor: '#0490de'
    }, {
      backgroundColor: '#7abfe6c2',
      borderColor: '#7abfe6',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff'
    }, {
      backgroundColor: '#c0dceb99',
      borderColor: '#c0dceb',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff'
    }, {
      backgroundColor: '#c0dceb99',
      borderColor: '#c0dceb',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  public showEmpty: boolean = true;
  public showLoading: boolean = false;
  

  constructor(private forecastService: ForecastService) {
    let data = [0.891,0.932,0.963,0.985,0.997,0.999,0.991,0.973,0.946,0.909,0.863,0.808,0.745,0.675,0.598,0.515,0.427,0.334,0.239,0.141,0.041,-0.058,-0.157,-0.255,-0.350,-0.442,-0.529,-0.611,-0.687,-0.756,-0.818,-0.871,-0.916,-0.951,-0.977,-0.993,-0.999,-0.996,-0.982,-0.958,-0.925,-0.883,-0.832,-0.772,-0.705,-0.631,-0.550,-0.464,-0.373,-0.279,-0.182,-0.083,0.016,0.116,0.215,0.311,0.404,0.494,0.578,0.656,0.728,0.793,0.850,0.898,0.937,0.967,0.988,0.998,0.998,0.989,0.969,0.940,0.902,0.854,0.798,0.734,0.662,0.584,0.501,0.412,0.319,0.222,0.124,0.024,-0.075,-0.174,-0.271,-0.366,-0.457,-0.544,-0.625,-0.699,-0.767,-0.827,-0.879,-0.922,-0.956,-0.980,-0.995,-0.999];
    this.dataset = data.map((x, i) => {
      let d = {};
      d['value'] = x;
      return d;
    });
    this.forecastForm = new FormGroup({
      model: new FormControl('autoarima_python', [Validators.required]),
      alpha: new FormControl(0.80, [Validators.required]),
      n_periods: new FormControl(50, [Validators.required]),
      seasonal: new FormControl(true, [Validators.required])
    });
    this.updateChart();
  }

  ngOnInit(): void {
  }

  public changeDataset = (changes: any[], source: string) => {
    if(source == 'edit' && changes[0][1] == 'value') {
      this.updateChart()
    }
  }

  clear() {
    for (let line of this.lineChartData) {
      line['data'] = [];
    }
    this.lineChartLabels = [];
  }

  updateChart() {
    this.clear();
    let datasetValues = this.dataset.map((v, i) => v['value']);
    let n_periods = this.forecastForm.value['n_periods'];
    let datasetEmpty = Array(n_periods).fill(null);
    let datasetChart = datasetValues.concat(datasetEmpty);
    this.lineChartData[0]['data'] = datasetChart;
    
    this.lineChartLabels = datasetChart.map((v, i) => 'C' + (i+1));
    this.showEmpty = false;
  }

  onSubmit() {
    this.showEmpty = false;
    this.showLoading = true;
    
    let previous:number[] = this.dataset.map((v, i) => v['value']).filter(v => v != null);
    let model:string = this.forecastForm.value['model'];
    let params = {
      'alpha': this.forecastForm.value['alpha'],
      'n_periods': this.forecastForm.value['n_periods'],
      'seasonal': this.forecastForm.value['seasonal']
    }

    this.forecastService.forecast(previous, model, params).subscribe(data => {
      this.clear();

      let last_previous = previous[previous.length-1]
      let blank_spaces = Array(previous.length-1).fill(null).concat([last_previous])
      let forecast = blank_spaces.concat(data['forecast'])

      let upper = data['conf_int'].map((v: number[]) => v[1]);
      upper = blank_spaces.concat(upper);

      let lower = data['conf_int'].map((v: number[]) => v[0]);
      lower = blank_spaces.concat(lower);

      this.lineChartData[0]['data'] = previous;
      this.lineChartData[1]['data'] = forecast;
      this.lineChartData[2]['data'] = upper;
      this.lineChartData[3]['data'] = lower;

      let count_points = this.lineChartData[1]['data'].length;
      this.lineChartLabels = Array(count_points).fill(null).map((v, i) => '' + (i+1));

      this.showLoading = false;
    });
  }
  

}
