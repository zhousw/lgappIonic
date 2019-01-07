import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonUtil } from "../../../utils/commonUtil";
import * as $ from "jquery";
import * as Encrypt from 'jsencrypt';
import angular from 'angular';
import { LoginServiceProvider } from "../../../providers/login-service/login-service";
import { AppConfig } from "../../../app/appConfig";
import { Buffer } from 'buffer';

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
        console.log(password);
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
        this.commonUtil.toast_position("请检查所填信息",'bottom');
        return;
      }else if(password != repassword){
        this.commonUtil.toast_position("2次输入的密码不一致",'bottom');
        return;
      }
      let encrypt = new Encrypt.JSEncrypt();
      console.info(this.publicKey);
      encrypt.setPublicKey(this.publicKey);
      password = encrypt.encrypt(password);
      console.log(password)
      
      //console.log(new Buffer('YWRtaW4=','base64').toString());//解码
      //console.log(new Buffer('admin').toString('base64'));//编码

      //password = new Buffer(password).toString('base64');
      //console.log(password)

      let bytess = this.convertBase64ToBytes(password);
      console.log(bytess)
      //password = this.stringToByte(password);
      //console.log(password)
      
      password = this.Bytes2HexString(bytess);
      console.log(password)

      this.loginServiceProvider.carRegister(mobile,password,checkCode)
          .then(res=>{
            if(res.retcode == AppConfig.responseCode.successCode){
               this.tabs = 'register';
            }  
          })

    }

 stringToByte(str) {

  var bytes = new Array();

  var len, c;

  len = str.length;

  for(var i = 0; i < len; i++) {

    c = str.charCodeAt(i);

    if(c >= 0x010000 && c <= 0x10FFFF) {

      bytes.push(((c >> 18) & 0x07) | 0xF0);

      bytes.push(((c >> 12) & 0x3F) | 0x80);

      bytes.push(((c >> 6) & 0x3F) | 0x80);

      bytes.push((c & 0x3F) | 0x80);

    } else if(c >= 0x000800 && c <= 0x00FFFF) {

      bytes.push(((c >> 12) & 0x0F) | 0xE0);

      bytes.push(((c >> 6) & 0x3F) | 0x80);

      bytes.push((c & 0x3F) | 0x80);

    } else if(c >= 0x000080 && c <= 0x0007FF) {

      bytes.push(((c >> 6) & 0x1F) | 0xC0);

      bytes.push((c & 0x3F) | 0x80);

    } else {

      bytes.push(c & 0xFF);

    }

  }

  return bytes;

}

Bytes2HexString(arrBytes) {
  var str = "";
  for (var i = 0; i < arrBytes.length; i++) {
    var tmp;
    var num=arrBytes[i];    if (num < 0) {
    //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
      tmp =(255+num+1).toString(16);
    } else {
      tmp = num.toString(16);
    }
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
}

convertBase64ToBytes(base64Str) {
  var bytes = window.atob(base64Str); 
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
  ia[i] = bytes.charCodeAt(i);
  }
  return ia;
  } 

}


