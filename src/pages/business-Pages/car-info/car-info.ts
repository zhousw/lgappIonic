import {Component} from '@angular/core';
import {IonicPage, NavController,ModalController} from 'ionic-angular';
import {AppConfig} from "../../../app/appConfig";
import {CarModalPage} from "../../templates/car-modal/car-modal";

@IonicPage()
@Component({
  selector: 'page-car-info',
  templateUrl: 'car-info.html',
})
export class CarInfoPage {

  title = '车辆信息';

  userInfo = this.appConfig.getUserInfo();
  userId = this.userInfo.id;
  driver_img_code = ''
  constructor(
    public navCtrl: NavController,
    private appConfig:AppConfig,
    private modalCtrl:ModalController,
  ) {
    console.log(this.userInfo)
    this.driver_img_code = this.appConfig.getImgUrl()+this.userInfo.driver_img_code;
  }

  update_driverInfo(){
    let modal = this.modalCtrl.create('CarModalPage')
    modal.onDidDismiss( data=>{
      this.navCtrl.pop()
    })
    modal.present();
  }

}
