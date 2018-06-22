import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, Platform} from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonUtil } from '../../../utils/commonUtil';
import { AppConfig } from '../../../app/appConfig';
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera} from "@ionic-native/camera";
import {PayServiceProvider} from "../../../providers/pay-service/pay-service";

@IonicPage()
@Component({
  selector: 'page-driver-info',
  templateUrl: 'driver-info.html',
  providers:[
    UserServiceProvider,
    PayServiceProvider,
    Camera,
    ImagePicker
  ]
})
export class DriverInfoPage {

  userInfo = this.appConfig.getUserInfo()
  driving_img_code = ""
  private driverForm : FormGroup;
  constructor(
    public navCtrl: NavController,
    private formBuilder:FormBuilder,
    private commonUtil:CommonUtil,
    private appConfig:AppConfig,
    private userServiceProvider:UserServiceProvider,
    private actionSheetCtrl:ActionSheetController,
    private platform:Platform,
    private imagePicker:ImagePicker,
    public camera:Camera
  ) {
    this.driverForm=this.formBuilder.group({
      // drivingImgCode:['',Validators.required],
      drivingNo:['',Validators.required]
    });
    this.driving_img_code = this.appConfig.getImgUrl()+this.userInfo.driving_img_code;
  }

  closeModal(){
    this.navCtrl.pop();
  }

  modifyDriver(values){
    if( ! this.driverForm.valid){
      this.commonUtil.toast_position("请检查所填信息",'bottom');
      return;
    }
    this.userServiceProvider.modifyDriveringInfo(this.userInfo.id,values.drivingNo,"")//values.drivingImgCode
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
                this.commonUtil.toast_position("修改成功",'middle');
                window.localStorage.removeItem("userInfo");
                window.localStorage.setItem("userInfo",res.retObj);
                this.userInfo = res.retObj
                this.closeModal();
        }
      })
  }

  update_drivingImg(){
    let actionSheet = this.actionSheetCtrl.create({
      title: '图片来源',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            this.openCamera();
            this.userServiceProvider.uploadImg(this.driving_img_code);
          }
        },{
          text: '从相册中选择',
          handler: () => {
            this.selectImg();
            this.userServiceProvider.uploadImg(this.driving_img_code);
          }
        },{
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

  //选择图片
  selectImg (){
    this.platform.ready().then(() => {
      if(this.imagePicker.hasReadPermission()){  //权限
        this.imagePicker.getPictures(this.appConfig.imagePickerOptions)
          .then((results)=> {
            if(results.length == 1){
              this.driving_img_code = results;
            }
          })
      }else{    //ios中
        this.commonUtil.toast_position("请在设置中开启访问权限","middle")
      }
    });
  }

  //打开摄像头
  openCamera (){
    const cameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 320,
      targetHeight: 512,
      saveToPhotoAlbum: false, //保存进手机相册
      correctOrientation:true
    }
    this.camera.getPicture(cameraOptions).then((imageData) =>{
      this.driving_img_code = imageData;
    })
  }

}
