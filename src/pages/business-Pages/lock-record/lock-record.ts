import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommonUtil} from "../../../utils/commonUtil";
import {LockServiceProvider} from "../../../providers/lock-service/lock-service";
import {AppConfig} from "../../../app/appConfig";

@IonicPage()
@Component({
  selector: 'page-lock-record',
  templateUrl: 'lock-record.html',
  providers:[
    LockServiceProvider
  ]
})
export class LockRecordPage {

  title = '用锁记录';

  userId = this.appConfig.getUserInfo().id;
  currentPage = 1
  lockOrderList = []
  hasNextPage = true
  hasPreviousPage = false
  searchContext = ""

  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private lockServiceProvider:LockServiceProvider,
    private appConfig:AppConfig
  ) {
      let loading = this.commonUtil.loading('努力加载中···');
       this.initData();
      loading.dismiss();
  }
  search(searchContext){
    this.qryLockOrder(this.currentPage,true,searchContext,searchContext,searchContext,searchContext,searchContext);
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
    this.qryLockOrder(this.currentPage,true,"","","","","");
  }

  qryLockOrder(currentPage,isFirst:boolean,container_no,order_no,lock_no,startTime,endTime){
    this.lockServiceProvider.qryLockOrder(this.userId,currentPage,container_no,order_no,lock_no,startTime,endTime)
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
    this.qryLockOrder(this.currentPage,false,"","","","","");
  }

  loadPrevious(){
    this.currentPage = this.currentPage - 1;
    this.qryLockOrder(this.currentPage,false,"","","","","");
  }
}
