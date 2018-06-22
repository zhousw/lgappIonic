import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController, ActionSheet} from 'ionic-angular';
import { ComponentUtil } from "../../../utils/ComponentUtil";
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { LockServiceProvider } from "../../../providers/lock-service/lock-service";
import { AppConfig } from "../../../app/appConfig";
import { CommonUtil } from "../../../utils/commonUtil";
import { PayServiceProvider } from "../../../providers/pay-service/pay-service";
@IonicPage()
@Component({
  selector: 'page-lock',
  templateUrl: 'lock.html',
  providers:[
    ComponentUtil,
    ZBar,
    LockServiceProvider,
    PayServiceProvider
  ]
})
export class LockPage {

  title = '我的锁';

  userId = this.appConfig.getUserInfo().id;

  balanceInfo = {}
  balance_amount = ""
  roadLockList = []
  deposit_amount = 0;
  price = "";

  currentPage = 1
  hasNextPage = true
  hasPreviousPage = false
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl : ModalController,
    private alertCtrl:AlertController,
    private componentUtil:ComponentUtil,
    private zbar: ZBar,
    private lockServiceProvider:LockServiceProvider,
    private commonUtil:CommonUtil,
    private appConfig:AppConfig,
    private payServiceProvider:PayServiceProvider
  ) {
      let loading = this.commonUtil.loading('努力加载中···');
        this.queryRoadLockOrder(this.currentPage,true);
        this.qryBalance();
        this.qryDepositAndPrice();
      loading.dismiss();
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
    this.queryRoadLockOrder(this.currentPage,false);
  }

  loadPrevious(){
    this.currentPage = this.currentPage - 1;
    this.queryRoadLockOrder(this.currentPage,false);
  }

  queryRoadLockOrder(currentPage,isFirst:boolean){
    this.lockServiceProvider.queryRoadLockOrder(this.userId,currentPage)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
            let resultData = this.commonUtil.parseData(res.retObj)
            this.roadLockList = resultData.list

            this.hasNextPage = resultData.hasNextPage
             if( (! this.hasNextPage) && (! isFirst)){
              this.commonUtil.toast_position("我是有底限的");
             } 
             this.hasPreviousPage = resultData.hasPreviousPage
          }
        })
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
    return this.payServiceProvider.qryDepositAndPrice(this.userId) 
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
          this.deposit_amount = this.commonUtil.parseData(res.retObj).deposit_amount
          this.price = this.commonUtil.parseData(res.retObj).price
        }
      })       
  }


  hireLock(){
    let modal = this.modalCtrl.create('PayOfLockPage',{ price: this.price })
    modal.onDidDismiss( data=>{
      this.queryRoadLockOrder(this.currentPage,true);
    })
    modal.present();
  }

  myLock(){
    this.navCtrl.push('MyLockPage');
  }

  moneyRecordSearch(){
    this.navCtrl.push('EarnestMoneyPage');
  }

  accountRecordSearch(){
    this.navCtrl.push('AccountRecordPage');
  }

  lockRecord(){
    this.navCtrl.push('LockRecordPage');
  }

  earnest_Recharge(){
    this.alertCtrl.create({
      title:'保证金充值',
      subTitle:'当前保证金余额为'+this.balance_amount+'元',
      inputs:[
        {
          type: 'radio',
          label: this.deposit_amount+'元(两把锁)',
          value: this.deposit_amount.toString(),
          checked: true
        },
        {
          type: 'radio',
          label: this.deposit_amount * 2+'元(两把锁)',
          value: (this.deposit_amount * 2).toString()
        }
      ],
      buttons:[
        {
          text: '取消',
          handler: data => {
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

  qrScan(old_lock_no){
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions: '请将二维码置于中央',
      drawSight: true
    };

    this.zbar.scan(options)
      .then(result => {
        this.lockServiceProvider.chgRoadLockNo(this.userId,old_lock_no,result)
            .then(res=>{
              if(res.retcode == AppConfig.responseCode.successCode){
                let resultData = this.commonUtil.parseData(res.retObj)
                if(resultData.retSts == 1){
                  this.commonUtil.toast_position("更换成功",'middle');
                  this.queryRoadLockOrder(this.currentPage,true);
                }else{
                  this.commonUtil.toast_position(resultData.resMsg,'middle');
                }
              }
            })      
      })
      .catch(error => {
        console.log(error); // Error
      });
  }



}
