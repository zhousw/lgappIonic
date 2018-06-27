import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";
import { PayServiceProvider } from "../../../providers/pay-service/pay-service";
import { AppConfig } from "../../../app/appConfig";

import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-account-record',
  templateUrl: 'account-record.html',
  providers:[
    PayServiceProvider,
    DatePicker,
    DatePipe
  ]
})
export class AccountRecordPage {

  title = '账户交易记录';
  
  userId = this.appConfig.getUserInfo().id;
  balnceAmountList = []

  currentPage = 1
  hasNextPage = true
  hasPreviousPage = false
  startDate = '';
  endDate = '';
  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private payServiceProvider:PayServiceProvider,
    private appConfig:AppConfig,
    private datePicker: DatePicker,
    private datePipe :DatePipe 
  ) {
    let loading = this.commonUtil.loading('努力加载中···');
        this.qryBalnceAmount(this.currentPage,true,"","");
      loading.dismiss();
  }

  search(){
    if(this.commonUtil.isNull(this.startDate) || this.commonUtil.isNull(this.endDate)){
      this.commonUtil.toast_position("日期不能为空");
      return ;
    }
    this.qryBalnceAmount(this.currentPage,true,this.datePipe.transform(this.startDate,"yyyyMMddHHmmss"),this.datePipe.transform(this.endDate,"yyyyMMddHHmmss"));
  }

  startDatePickeer(){
   this.datePic().then(
      date => {
        this.startDate = this.datePipe.transform(date,"yyyy-MM-dd HH:mm:ss");
      },
      err => console.log(err)
    );
  }

  endDatePickeer(){
    this.datePic().then(
      date => {
        this.endDate = this.datePipe.transform(date,"yyyy-MM-dd HH:mm:ss");
      },
      err => console.log(err)
    );
  }

  datePic(){
    return  this.datePicker.show({
      date: new Date(),
      mode: 'date | yyyyMMddHHmmss',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      allowFutureDates :false,
      is24Hour :true
    })
  }

  qryBalnceAmount(currentPage,isFirst:boolean,startTime,endTime){
    this.payServiceProvider.qryBalnceAmount(this.userId,currentPage,startTime,endTime)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
            let resultData = this.commonUtil.parseData(res.retObj)
            this.balnceAmountList = resultData.list
            
            
            this.hasNextPage = resultData.hasNextPage
            if( (! this.hasNextPage) && ( ! isFirst)){
             this.commonUtil.toast_position("我是有底限的");
            } 
            this.hasPreviousPage = resultData.hasPreviousPage
          }
        })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      if(this.hasPreviousPage){
        this.loadPrevious ()
      }
      refresher.complete();
    }, 1000);
  }

  
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if(this.hasNextPage){
        this.loadNext();
      }
      infiniteScroll.complete();
    }, 1000);
  } 

  loadNext(){
    this.currentPage = this.currentPage + 1;
    this.qryBalnceAmount(this.currentPage,false,this.startDate,this.endDate);
  }

  loadPrevious(){
    this.currentPage = this.currentPage - 1;
    this.qryBalnceAmount(this.currentPage,false,this.startDate,this.endDate);
  }

}
