import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { LockServiceProvider } from "../../../providers/lock-service/lock-service";
import { AppConfig } from "../../../app/appConfig";
import { CommonUtil } from "../../../utils/commonUtil";
@IonicPage()
@Component({
  selector: 'page-add-of-lock',
  templateUrl: 'add-of-lock.html',
  providers:[
    ZBar,
    LockServiceProvider
  ]
})
export class AddOfLockPage {

  lock={
    lockStatus : 0 ,
    lock_name : "",
    lock_no : ''
  }
  
  userId = this.appConfig.getUserInfo().id;
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     private viewCtrl : ViewController,
     private zbar: ZBar,
     private lockServiceProvider:LockServiceProvider,
     private commonUtil:CommonUtil,
     private appConfig:AppConfig
    ) {
  }

  closeModal(){
    this.navCtrl.pop();
  }

  add(){
    this.lockServiceProvider.addOwnLock(this.userId,this.lock.lock_no,this.lock.lock_name)
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
          console.log(this.commonUtil.parseData(res.retObj))
          this.viewCtrl.dismiss(this.lock);
        }
      })
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

}
