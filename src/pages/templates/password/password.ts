import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CommonUtil } from "../../../utils/commonUtil";
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import $ from 'jquery';
import { AppConfig } from "../../../app/appConfig";
import { UserServiceProvider } from "../../../providers/user-service/user-service";

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
  providers:[
    UserServiceProvider
  ]
})
export class PasswordPage {
  title='修改密码';

  userId = this.appConfig.getUserInfo().id;
  private passForm : FormGroup;
  constructor(
    public navCtrl: NavController, 
    private formBuilder:FormBuilder,
    private commonUtil:CommonUtil,
    private appConfig:AppConfig,
    private UserServiceProvider:UserServiceProvider
  ) {
      this.passForm=this.formBuilder.group({
        oldPassword:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])],
        newPassword:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])],
        rePassword:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])]
    });
  }

  closeModal(){
    this.navCtrl.pop();
  }

  modifyPassword(values){
        let oldPassword = $.trim(values.oldPassword)
        let newPassword = $.trim(values.newPassword)
        let rePassword  = $.trim(values.rePassword)
        if( this.commonUtil.isNull(oldPassword)){
          this.commonUtil.toast_position("请输入原密码",'bottom');
          return;
        }else if( this.commonUtil.isNull(newPassword)){
          this.commonUtil.toast_position("请输入新密码",'bottom');
          return;
        }else if( this.commonUtil.isNull(rePassword)){
          this.commonUtil.toast_position("请输入确认密码",'bottom');
          return;
        }else if( ! (newPassword == rePassword)){
          this.commonUtil.toast_position("两次密码不相同",'bottom');
          return;
        }
      let loading = this.commonUtil.loading('努力加载中···');
      this.UserServiceProvider.modifyPassword(this.userId,oldPassword,newPassword)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){

          }
        })
      loading.dismiss();
  }



}
