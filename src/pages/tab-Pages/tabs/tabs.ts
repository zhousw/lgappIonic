import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
  providers:[
  ]
})
export class TabsPage {

  Home = 'HomePage';
  container = 'ContainerPage';
  myLock = 'LockPage';
  personalCenter = 'PersonalCenterPage'
    
  constructor(
    private navCtrl:NavController,
    private commonUtil:CommonUtil
  ) {
    if( this.commonUtil.isNull(window.localStorage.getItem("userInfo")) || 
        this.commonUtil.isNull(window.localStorage.getItem("_token"))){
      this.navCtrl.setRoot("LoginPage");
    }
  }

  

}
