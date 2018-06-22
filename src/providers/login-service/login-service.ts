
import { Injectable } from "@angular/core";
import { CommonServiceProvider } from "../common-service/common-service";
import { AppConfig } from "../../app/appConfig";
import { RequestData } from "../../model/requestData";
@Injectable()
export class LoginServiceProvider {

  private requestData = new RequestData();
  constructor(
    private commonServiceProvider : CommonServiceProvider,
    private appConfig:AppConfig
  ) {}

  /**
   * 获取公钥
   */
  getPublicKey(reqKey){
        let requestData = new RequestData();
        requestData.set_reqHead("","1","0");
        requestData.set_reqKey(reqKey);
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/getPublicKey",requestData);
  }

  /**
   * 车主登陆
   */
  login(userName,password,imei,phoneNum){
      this.requestData.set_reqBody({
          mobile:userName,
          password:password,
          imei:imei,
          phoneNum:phoneNum
      })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/carLogin",this.requestData);
  }

  /**
   * 注册
   */
  carRegister(mobile,password,checkCode){
      this.requestData.set_reqBody({
        mobile:mobile,
        password:password,
        checkCode:checkCode 
    })
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/carRegister",this.requestData);
  }

  /**
   * 发送验证码
   */
  sendCheckCode(mobile){
    this.requestData.set_reqBody({
      mobile:mobile,
      type:1,
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/sendCheckCode",this.requestData);
  }
}
