import {Component, Injectable} from "@angular/core";
import {ActionSheetController} from 'ionic-angular';
import {PayServiceProvider} from "../providers/pay-service/pay-service";
import {AppConfig} from "../app/appConfig";
import {CommonUtil} from "../utils/commonUtil";
import {WechatChenyu} from "wechat-chenyu";
import {Md5} from "ts-md5";
import angular from "angular";

// declare var Wechat: any;  // 此处声明plugin.xml中clobbers对应的值
@Injectable()
export class ComponentUtil{
    constructor(
        private actionSheetCtrl:ActionSheetController,
        private payServiceProvider:PayServiceProvider,
        private commonUtil:CommonUtil,
        private wechat:WechatChenyu
    ){}

    wechatPaySheet(userId,amount,amount_type)  {
        let actionSheet = this.actionSheetCtrl.create({
          title: '确认付款',
          enableBackdropDismiss:false,
          buttons: [
            {
              text: '微信支付',
              role: 'destructive',
              handler: () => {
                this.payServiceProvider.chargeAmount(userId,amount,amount_type)
                  .then(res=>{
                    alert(angular.toJson(res))
                    if(res.retcode == AppConfig.responseCode.successCode){
                      let resultData = this.commonUtil.parseData(res.retObj)
                      this.wechatPay(resultData.prepay_id);
                    }
                  })
              }
            },
            {
              text: '取消',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });

        return actionSheet;
      }

    PaySheet(userId,amount,amount_type) {
        let actionSheet = this.actionSheetCtrl.create({
          title: '确认付款',
          enableBackdropDismiss:false,
          buttons: [
            {
              text: '余额支付',
              role: 'destructive',
              handler: () => {
                this.payServiceProvider.chargeAmount(userId,amount,amount_type)
                  .then(res=>{
                    alert(angular.toJson(res))
                    if(res.retcode == AppConfig.responseCode.successCode){
                      this.commonUtil.toast_position("充值成功",'middle');
                    }
                  })
              }
            },
            {
              text: '微信支付',
              handler: () => {
                this.payServiceProvider.chargeAmount(userId,amount,amount_type)
                  .then(res=>{
                    alert(angular.toJson(res))
                    if(res.retcode == AppConfig.responseCode.successCode){
                      let resultData = this.commonUtil.parseData(res.retObj)
                      this.wechatPay(resultData.prepay_id);
                    }
                  })
              }
            },
            {
              text: '取消',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });

        return actionSheet;
      }

      private wechatPay(prepayid){

        let appid="wxd585ab5057bdc266";
        let noncestr = this.commonUtil.randomString(32);
        let timestamp = Math.round(new Date().getTime()/1000).toString();//时间戳 单位需要为秒(10位数字)
        let temp="appid="+appid+"&partnerid=1505050301&prepayid="+prepayid+"&package=Sign=WXPay&noncestr="+noncestr+"&timestamp="+timestamp+"";
        let signTemp = temp+"&key=zjlgwlapipasswordaaaaaaaaaaaaaaa" //商户平台设置的密钥key
        alert("noncestr:"+noncestr.length)
        let sign = Md5.hashStr(signTemp).toString().toUpperCase() //MD5签名方式

        let params = {
            appid : appid,
            partnerid: '1505050301',
            prepayid: prepayid,
            package:'Sign=WXPay',
            noncestr: noncestr,
            timestamp: timestamp,
            sign: sign,
         };

         console.log(params)
        alert(angular.toJson(params))
        this.wechat.sendPaymentRequest(params).then((result)=>{
             //支付成功
            alert(result)
          },(error)=>{
          //支付失败
            alert(error)
          })
               
      }

    // sendPaymentRequest(params) {
    //     return new Promise((resolve, reject) => {
    //       this.wechat.sendPaymentRequest(params, result => {
    //         resolve(result);
    //       }, error => {
    //         reject(error);
    //       });
    //     });
    //   }
    
}
