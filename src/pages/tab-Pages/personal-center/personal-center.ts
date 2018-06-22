import {Component} from '@angular/core';
import {ActionSheet, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ComponentUtil} from "../../../utils/ComponentUtil";
import {PayServiceProvider} from "../../../providers/pay-service/pay-service";
import {AppConfig} from "../../../app/appConfig";
import {CommonUtil} from "../../../utils/commonUtil";
import angular from 'angular';
import {UserServiceProvider} from "../../../providers/user-service/user-service";

@IonicPage()
@Component({
  selector: 'page-personal-center',
  templateUrl: 'personal-center.html',
  providers:[
    ComponentUtil,
    PayServiceProvider,
    UserServiceProvider
  ]
})
export class PersonalCenterPage {

  userInfo = this.appConfig.getUserInfo()
  userId = this.userInfo.id;

  balanceInfo = {}
  balance_amount = 0
  deposit_amount = 0
  user_head_img_code = ""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl:AlertController,
    private componentUtil:ComponentUtil,
    private payServiceProvider:PayServiceProvider,
    private appConfig:AppConfig,
    private commonUtil : CommonUtil

  ) {
        let loading = this.commonUtil.loading('努力加载中···');
          this.qryBalance();
          this.qryDepositAndPrice();
        loading.dismiss();
       this.user_head_img_code =  this.appConfig.getImgUrl()+this.userInfo.user_head_img_code

  }


  qryBalance(){
    this.payServiceProvider.qryBalance(this.userId)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
            this.balanceInfo =  this.commonUtil.parseData(res.retObj)
            this.balance_amount =  this.commonUtil.parseData(res.retObj).balance_amount
          }
        })
  }

  qryDepositAndPrice(){
    this.appConfig.getUserInfo().bankName = "test11111";
    window.localStorage.setItem("userInfo",angular.toJson(this.appConfig.getUserInfo()));
    console.log(this.appConfig.getUserInfo().bankName)
      return this.payServiceProvider.qryDepositAndPrice(this.userId)
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
          this.deposit_amount = this.commonUtil.parseData(res.retObj).deposit_amount
        }
      })
  }

  moneyRecordSearch(){
    this.navCtrl.push('EarnestMoneyPage');
  }

  accountRecordSearch(){
    this.navCtrl.push('AccountRecordPage');
  }

  earnest_Recharge(){
    this.alertCtrl.create({
      title:'保证金充值',
      subTitle:'当前保证金余额为'+this.balance_amount+'元',
      inputs:[
        {
          type: 'radio',
          label: this.deposit_amount+'元(两把锁)',
          value: 'single',
          checked: true
        },
        {
          type: 'radio',
          label: this.deposit_amount * 2+'元(两把锁)',
          value: 'double'
        }
      ],
      buttons:[
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
            var actionSheet:ActionSheet = this.componentUtil.PaySheet(this.userId,data,0)
            actionSheet.onWillDismiss(data=>{
             this.qryBalance();
           })
           actionSheet.present();

         }
        }
      ]
    }).present()

  }

  account_Recharge(){
    this.alertCtrl.create({
      title:'余额充值',
      inputs:[
        {
          type: 'text',
          placeholder:'充值金额',
          name:'amount'
        }
      ],
      buttons:[
        {
          text: '确认去支付',
          handler: data => {
            this.componentUtil.wechatPaySheet(this.userId,data.amount,1) ;
          }
        }
      ]
    }).present();
  }

  carInfo(){
    this.navCtrl.push("CarInfoPage");
  }

  personalSettings(){
    this.navCtrl.push('PersonalSettingsPage');
  }

  systemSettings(){
    this.navCtrl.push('SystemSettingsPage');
  }

  aboutUs(){
    this.navCtrl.push('AboutUsPage');
  }

}
