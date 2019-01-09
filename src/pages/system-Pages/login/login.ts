import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonUtil } from "../../../utils/commonUtil";
import * as $ from "jquery";
import * as Encrypt from 'jsencrypt';
import angular from 'angular';
import { LoginServiceProvider } from "../../../providers/login-service/login-service";
import { AppConfig } from "../../../app/appConfig";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[
    LoginServiceProvider
  ]
})
export class LoginPage {

  title = '登录/注册';
  tabs: string ="login";
  loginInfo = {
    username:'',
    password:''
  }
  private loginForm : FormGroup;
  private registerForm : FormGroup;
  mobile = '';
  publicKey = window.localStorage.getItem("publicKey");
  constructor(
    public navCtrl: NavController,
    private commonUtil:CommonUtil,
    private formBuilder:FormBuilder,
    private loginServiceProvider:LoginServiceProvider,
  
  ) {
        this.loginForm=this.formBuilder.group({
          userName:['',Validators.compose([Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(11), Validators.maxLength(11)])],
          password:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])]
       });
       this.registerForm=this.formBuilder.group({
        mobile:['',Validators.compose([Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(11), Validators.maxLength(11)])],
        password:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])],
        repassword:['',Validators.compose([Validators.required,Validators.maxLength(12),Validators.minLength(6)])],
        checkCode:['',Validators.required]
     });
}

    login(values){
        let userName = $.trim(values.userName)
        let password   = $.trim(values.password)
        if( this.commonUtil.isNull(userName)){
          this.commonUtil.toast_position("请输入用户名！",'bottom');
          return;
        }else if( this.commonUtil.isNull(password)){
          this.commonUtil.toast_position("请输入密码",'bottom');
          return;
        }
        let loading = this.commonUtil.loading('努力加载中···');
      
        let encrypt = new Encrypt.JSEncrypt();
        encrypt.setPublicKey(this.publicKey);
        password = encrypt.encrypt(password);
        let imei="";
        let phoneNum = userName;
  
        this.loginServiceProvider.login(userName,password,imei,phoneNum)
                      .then(res=>{
                        if(res.retcode == AppConfig.responseCode.successCode){
                            window.localStorage.setItem("_token",angular.fromJson(res.retObj).token);
                            window.localStorage.setItem("userInfo",res.retObj);
                            this.loginInfo.username = userName;
                            this.loginInfo.password = password;
                            window.localStorage.setItem("loginInfo",angular.toJson(this.loginInfo));
                            this.navCtrl.setRoot('TabsPage');
                        }  
                      })
            
        loading.dismiss();
    }

    sendCheckCode(){
      this.loginServiceProvider.sendCheckCode(this.mobile)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
            this.commonUtil.toast_position("发送成功",'middle');
          }  
        })
    }

    register(values){
      let mobile = $.trim(values.mobile)
      let checkCode = $.trim(values.checkCode)
      let password = $.trim(values.password)
      let repassword = $.trim(values.repassword)

      if( ! this.registerForm.valid){
        this.commonUtil.toast_position("请检查所填信息");
        return;
      }else if(password != repassword){
        this.commonUtil.toast_position("2次输入的密码不一致");
        return;
      }
      let encrypt = new Encrypt.JSEncrypt();
      encrypt.setPublicKey(this.publicKey);
      password = encrypt.encrypt(password);
      password = this.commonUtil.convertBase64ToBytes(password);
      password = this.commonUtil.bytes2HexString(password);

      this.loginServiceProvider.carRegister(mobile,password,checkCode)
        .then(res=>{
          if(res.retcode == AppConfig.responseCode.successCode){
              this.tabs = 'login';
              this.commonUtil.toast_position("注册成功,请登陆后完善信息");
          }  
      })
    }
}


