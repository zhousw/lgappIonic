import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ActionSheetController } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";
import { LockServiceProvider } from "../../../providers/lock-service/lock-service";
import { AppConfig } from "../../../app/appConfig";

@IonicPage()
@Component({
  selector: 'page-my-lock',
  templateUrl: 'my-lock.html',
  providers:[
    LockServiceProvider
  ]
})
export class MyLockPage {

  title = '我的锁';
  lockList=[]

  userId = this.appConfig.getUserInfo().id;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private ModalCtrl:ModalController,
    private commonUtil:CommonUtil,
    private lockServiceProvider:LockServiceProvider,
    private appConfig:AppConfig,
    private actionSheetCtrl:ActionSheetController
  ) {
    this.qryOwnLock();
  }

  qryOwnLock(){
    this.lockServiceProvider.qryOwnLock(this.userId)
    .then(res=>{
      if(res.retcode == AppConfig.responseCode.successCode){
        this.lockList = this.commonUtil.parseData(res.retObj);
        console.log(this.commonUtil.parseData(res.retObj))
      }
    })
  }

  chooseLock(){
    this.PaySheet();
  }

  delete(index,lock_no){
      this.lockList.splice(index,1);

      this.lockServiceProvider.delOwnLock(this.userId,lock_no)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
            console.log(res.retObj);
            this.commonUtil.toast_position("删除成功");
          }
        })
  }

  addLock(){
    let modal = this.ModalCtrl.create('AddOfLockPage')
   
    modal.onDidDismiss( data=>{
      if( ! this.commonUtil.isNull(data)){
        let newLock = {
          lock_name:data.lock_name,
          lockStatus:data.lockStatus,
          lock_no:data.lock_no
        }
        this.lockList.push(newLock)
        this.commonUtil.toast_position("添加成功");
      }
    })
    modal.present();
  }

  private PaySheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '确认付款',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '余额支付',
          role: 'destructive',
          handler: () => {
            console.log('Archive clicked');
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

}
