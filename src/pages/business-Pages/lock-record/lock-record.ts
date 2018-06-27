import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommonUtil} from "../../../utils/commonUtil";
import {LockServiceProvider} from "../../../providers/lock-service/lock-service";
import {AppConfig} from "../../../app/appConfig";
import { DatePipe } from '@angular/common';
import { DatePicker } from '@ionic-native/date-picker';

@IonicPage()
@Component({
  selector: 'page-lock-record',
  templateUrl: 'lock-record.html',
  providers:[
    LockServiceProvider,
    DatePicker,
    DatePipe
  ]
})
export class LockRecordPage {

  title = '用锁记录';

  userId = this.appConfig.getUserInfo().id;
  currentPage = 1
  lockOrderList = []
  hasNextPage = true
  hasPreviousPage = false
  startDate = '';
  endDate = '';
  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private lockServiceProvider:LockServiceProvider,
    private appConfig:AppConfig,
    private datePicker: DatePicker,
    private datePipe :DatePipe 
  ) {
      let loading = this.commonUtil.loading('努力加载中···');
       this.initData();
      loading.dismiss();
  }

  search(){
    if(this.commonUtil.isNull(this.startDate) || this.commonUtil.isNull(this.endDate)){
      this.commonUtil.toast_position("日期不能为空");
      return ;
    }
    this.qryLockOrder(this.currentPage,true,this.datePipe.transform(this.startDate,"yyyyMMddHHmmss"),this.datePipe.transform(this.endDate,"yyyyMMddHHmmss"));
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

  initData(){
    this.qryLockOrder(this.currentPage,true,this.startDate,this.endDate);
  }

  qryLockOrder(currentPage,isFirst:boolean,startTime,endTime){
    this.lockServiceProvider.qryLockOrder(this.userId,currentPage,this.startDate,this.endDate)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
             let resultData = this.commonUtil.parseData(res.retObj)
             this.lockOrderList = resultData.list

             this.hasNextPage = resultData.hasNextPage
             if( (! this.hasNextPage) && ( ! isFirst)){
              this.commonUtil.toast_position("我是有底限的");
             }
             this.hasPreviousPage = resultData.hasPreviousPage
          }
        })
  }

  loadNext(){
    this.currentPage = this.currentPage + 1;
    this.qryLockOrder(this.currentPage,false,this.startDate,this.endDate);
  }

  loadPrevious(){
    this.currentPage = this.currentPage - 1;
    this.qryLockOrder(this.currentPage,false,this.startDate,this.endDate);
  }
}
