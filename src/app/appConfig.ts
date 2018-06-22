import {Injectable} from "@angular/core";
import angular from "angular";

@Injectable()
export class AppConfig{

  constructor(){

  }

    static responseCode = {
        successCode : "1",
        needLogin:"-1000",
        needLogin_2:"-2"    //坑爹
    }

    imagePickerOptions = {
      maximumImagesCount: 1
      // width: 320, //最大值
      // height: 0, //最大值
      // quality: 50  //最大值
    };

    getRootUrl() {
        return "http://114.55.144.109:80/APPServer";
        //return "http://192.168.0.3:8090/appsrv";
    }

    getUserInfo(){
        return angular.fromJson(window.localStorage.getItem("userInfo"));
    }

    getLoginInfo(){
        return angular.fromJson(window.localStorage.getItem("loginInfo"));
    }

    getImgUrl(){
      return "http://114.55.144.109:80/APPServer/downloadFile/";
    }

    getUploadImgUrl(){
        return "http://114.55.144.109:80/APPServer/uploadFile";
    }



}
