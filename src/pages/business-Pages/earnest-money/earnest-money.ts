import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";
import { PayServiceProvider } from "../../../providers/pay-service/pay-service";
import { AppConfig } from "../../../app/appConfig";
@IonicPage()
@Component({
  selector: 'page-earnest-money',
  templateUrl: 'earnest-money.html',
  providers:[
    PayServiceProvider
  ]
})
export class EarnestMoneyPage {

  title='保证金记录';

  userId = this.appConfig.getUserInfo().id;
  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private payServiceProvider:PayServiceProvider,
    private appConfig:AppConfig
  ) {
      let loading = this.commonUtil.loading('努力加载中···');
        this.qryDepositRecord("1","","");
      loading.dismiss();
  }

  qryDepositRecord(currentPage,startTime,endTime){
    this.payServiceProvider.qryDepositRecord(this.userId,currentPage,startTime,endTime)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){

          }
        })
  }

}
