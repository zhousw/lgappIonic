import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";
import { PayServiceProvider } from "../../../providers/pay-service/pay-service";
import { AppConfig } from "../../../app/appConfig";
@IonicPage()
@Component({
  selector: 'page-account-record',
  templateUrl: 'account-record.html',
  providers:[
    PayServiceProvider
  ]
})
export class AccountRecordPage {

  title = '账户交易记录';
  
  userId = this.appConfig.getUserInfo().id;
  balnceAmountList = []

  currentPage = 1
  hasNextPage = true
  hasPreviousPage = false
  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private payServiceProvider:PayServiceProvider,
    private appConfig:AppConfig
  ) {
    let loading = this.commonUtil.loading('努力加载中···');
        this.qryBalnceAmount(this.currentPage,true,"","");
      loading.dismiss();
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
    this.qryBalnceAmount(this.currentPage,false,"","",);
  }

  loadPrevious(){
    this.currentPage = this.currentPage - 1;
    this.qryBalnceAmount(this.currentPage,false,"","",);
  }

}
