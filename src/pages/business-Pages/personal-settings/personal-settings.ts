import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CommonUtil} from "../../../utils/commonUtil";
import {AppConfig} from "../../../app/appConfig";

@IonicPage()
@Component({
  selector: 'page-personal-settings',
  templateUrl: 'personal-settings.html',
  providers:[
  ]
})
export class PersonalSettingsPage {
  title = '个人设置';
  userInfo = this.appConfig.getUserInfo()

  status = this.userInfo.authent_sts;
  user_head_img_code = ""
  driving_img_code = ""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,

    private commonUtil:CommonUtil,
    private modalCtrl:ModalController,
    private appConfig:AppConfig
  ) {
    this.user_head_img_code =  this.appConfig.getImgUrl()+this.userInfo.user_head_img_code;
    this.driving_img_code = this.appConfig.getImgUrl()+this.userInfo.driving_img_code;
  }

  update_passWord(){
    this.modalCtrl.create('PasswordPage').present();
  }

  update_userInfo(){
    // if(this.checkStatus()){
    //   this.commonUtil.toast_position("用户已认证或认证中不可修改",'middle');
    //   return;
    // }
    let modal = this.modalCtrl.create('UserInfoPage')
    modal.onDidDismiss( data=>{
      this.navCtrl.pop()
    })
    modal.present();
  }

  update_driverInfo(){
    // if(this.checkStatus()){
    //   this.commonUtil.toast_position("用户已认证或认证中不可修改",'middle');
    //   return;
    // }
    let modal = this.modalCtrl.create('DriverInfoPage')
    modal.onDidDismiss( data=>{
      this.navCtrl.pop()
    })
    modal.present();
  }

  update_bankInfo(){
    // if(this.checkStatus()){
    //   this.commonUtil.toast_position("用户已认证或认证中不可修改",'middle');
    //   return;
    // }
    let modal = this.modalCtrl.create('BankInfoPage')
    modal.onDidDismiss( data=>{
      this.navCtrl.pop()
    })
    modal.present();
  }

  checkStatus(){
    if(this.status == 1){
      return true;
    }else{
      return false;
    }
  }

}
