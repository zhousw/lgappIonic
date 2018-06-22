import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-system-settings',
  templateUrl: 'system-settings.html',
})
export class SystemSettingsPage {

  title = '系统设置';
  constructor(
    public navCtrl: NavController, 
  ) {
  }

  // clearCache(){
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: '确定清除缓存吗',
  //     enableBackdropDismiss:false,
  //     buttons: [
  //       {
  //         text: '确定',
  //         role: 'destructive',
  //         handler: () => {
  //           console.log('Destructive clicked');
  //         }
  //       },
  //       {
  //         text: '取消',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  loginOut(){
      window.localStorage.removeItem("_token");
      window.localStorage.removeItem("userInfo");
      this.navCtrl.setRoot('LoginPage');
  }

}
