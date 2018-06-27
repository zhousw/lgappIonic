import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';

import { AppConfig } from "../../../app/appConfig";
import { PayServiceProvider } from "../../../providers/pay-service/pay-service";
import { CommonUtil } from "../../../utils/commonUtil";

@IonicPage()
@Component({
  selector: 'page-pay-of-lock',
  templateUrl: 'pay-of-lock.html',
  providers:[
    ZBar,
    PayServiceProvider
  ]
})
export class PayOfLockPage {

  userId = this.appConfig.getUserInfo().id;
  lock_no = ""
  price = ""
  container_no = ""
  orderInfo = {
    order_no : '',
    total_price : ''
  }
  payInfo = {
    order_no : '',
    prepay_id : ''  //微信支付的预支付ID
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private zbar: ZBar,
    private appConfig:AppConfig,
    private actionSheetCtrl:ActionSheetController,
    private payServiceProvider:PayServiceProvider,
    private commonUtil:CommonUtil
  ) {
    this.price = navParams.get('price');
  }

  closeModal(){
    this.navCtrl.pop();
  }

  toPay(){
    this.PaySheet(this.userId,this.lock_no,this.container_no);
  }

  qrScan(){
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions: '请将二维码置于中央',
      drawSight: true
    };

    this.zbar.scan(options)
      .then(result => {
        alert("结果：" + result); // Scanned code
      })
      .catch(error => {
        alert(error); // Error message
      });
  }

  private PaySheet(userId,lock_no,container_no) {
    this.payServiceProvider.depositEnough(userId)
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
          let enoughResult =  this.commonUtil.parseData(res.retObj).enough
          console.log("enoughResult:"+enoughResult)
          if(enoughResult == 0){
            this.commonUtil.toast_position("保证金不足,请先充值",'middle');
            return;
          }

          let actionSheet = this.actionSheetCtrl.create({
            title: '确认付款',
            enableBackdropDismiss:false,
            buttons: [
              {
                text: '余额支付',
                role: 'destructive',
                handler: () => {
                  let loading = this.commonUtil.loading('努力加载中···');
                  this.payServiceProvider.createLockOrder(userId,lock_no,1,container_no)
                    .then(res=>{
                      if(res.retcode == AppConfig.responseCode.successCode){
                        this.orderInfo = this.commonUtil.parseData(res.retObj)
                        console.log("orderInfo:"+this.orderInfo);
      
                        this.payServiceProvider.payLockOrder(userId,this.orderInfo.total_price,0,this.orderInfo.order_no)
                            .then(res=>{
                              if(res.retcode == AppConfig.responseCode.successCode){
                                this.payInfo = this.commonUtil.parseData(res.retObj)
                                this.commonUtil.toast_position("支付成功",'middle');
                                this.closeModal()
                              }
                            })    
                      }
                    })  
                     loading.dismiss();     
                }
              },
              {
                text: '微信支付',
                handler: () => {
                  console.log('Archive clicked');
                }
              },
              {
                text: '取消',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          actionSheet.present();
        }
      })
    
  }

}
