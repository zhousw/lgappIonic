import { Injectable} from "@angular/core";
import * as angular from 'angular';
import { ToastController,LoadingController  } from 'ionic-angular';

@Injectable()
export class CommonUtil{

    constructor(
        private  toastCtrl    : ToastController,
        private  loadCtrl     : LoadingController
    ){ }

    /**
     * 判断是否为空
     * @param data 数据
     */
    public isNull (data){
        if(data == null || data == '' || angular.isUndefined(data)){
            return true;
        }else{
            return false;
        }
    }

   /**
    * 替换字符串数据中的null，默认替换为0.00，
    * @param data 原数据
    * @param type 类型：1-empty 则替换为空字符串
    */
    public parseData (data,type?){
        let resultData = angular.fromJson(data);
        for (let key in resultData) {
         let value = resultData[key];
             if(value == "null"){
                 if(type != "empty"){
                    resultData[key] = "0.00";
                 }else{
                    resultData[key] = "";
                 }
             }
        }
       return resultData;
     }

    /**
     * 通用消息提示
     * @param msg 提示信息
     * @param position 位置（"top", "middle", "bottom"，默认bottom
     * @param time 时间（单位毫秒），默认1.5秒
     */
    toast_position(msg:string,position?:string,time?:number){
        this.toastCtrl.create({
            message : msg,
            duration: time || 1500,
            position: position || "bottom",
            cssClass:'toast-text'
          }).present();
    };

    /**
     * 通用消息提示（带关闭按钮）
     * @param msg 提示信息
     * @param position 位置（"top", "middle", "bottom"）
     */
    Toast_closeButton(msg:string,position:string) {
         this.toastCtrl.create({
          message: msg,
          position: position,
          showCloseButton:true,
          closeButtonText:'关闭',
          dismissOnPageChange:true,
          cssClass:'toast-text'
        }).present();
    }

    /**
     * 通用加载提示
     * @param msg 提示信息
     * @returns 返回加载对象
     */
    loading(msg:string){
        let loader = this.loadCtrl.create({
            content: msg,
          });
          loader.present();
          return loader;
    }

    /**
     * 生成随机字符串
     * @param expect 位数
     */
    randomString(expect) {
			let str = Math.random().toString(36).substring(2);
			while (str.length < expect) {
					str += Math.random().toString(36).substring(2);
			}
			return str.substring(0, expect);
    }

    bytes2HexString(arrBytes) {
			var str = "";
			for (var i = 0; i < arrBytes.length; i++) {
				var tmp;
				var num=arrBytes[i];    if (num < 0) {
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