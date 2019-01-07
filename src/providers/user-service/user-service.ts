import {Injectable} from '@angular/core';
import {RequestData} from '../../model/requestData';
import {CommonServiceProvider} from "../common-service/common-service";
import {AppConfig} from "../../app/appConfig";
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { CommonUtil } from "../../utils/commonUtil";
import angular from 'angular';

@Injectable()
export class UserServiceProvider {

  private requestData = new RequestData();
  constructor(
    private commonServiceProvider : CommonServiceProvider,
    private appConfig:AppConfig,
    private fileTransfer: FileTransfer,
    private commonUtil:CommonUtil
  ) {}

  /**
   * 修改密码
   */
  modifyPassword(userId,oldPassword,newPassword){
      this.requestData.set_reqBody({
        userId:userId,
        oldPassword:oldPassword,
        newPassword:newPassword
      })
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/modifyPassword",this.requestData);
  }

  /**
   * 账户信息修改
   * @param userId
   * @param mobile
   */
  modifyUserInfo(userId,mobile){
    this.requestData.set_reqBody({
      userId:userId,
      mobile:mobile
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/modifyUserInfo",this.requestData);
  }

  /**
   * 账户信息修改
   * @param userId
   * @param drivingNo 驾驶证编号
   * @param drivingImgCode 驾驶证图片CODE
   */
  modifyDriveringInfo(userId,drivingNo,drivingImgCode){
    this.requestData.set_reqBody({
      userId:userId,
      drivingNo:drivingNo,
      drivingImgCode:drivingImgCode
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/modifyUserInfo",this.requestData);
  }

  /**
   * 账户信息修改
   * @param userId
   * @param plateNo 车牌号
   * @param driverNo 行驶证编号
   * @param driverImgCode 行驶证图片CODE
   */
  modifyDriverInfo(userId,plateNo,driverNo,driverImgCode){
    this.requestData.set_reqBody({
      userId:userId,
      plateNo:plateNo,
      driverNo:driverNo,
      driverImgCode:driverImgCode
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/modifyUserInfo",this.requestData);
  }

  /**
   * 银行卡绑定
   * @param userId
   * @param bankName  银行名称
   * @param bankDeposit 开户行名称
   * @param cardName
   * @param cardNo
   */
  bindBankCard(userId,bankName,bankDeposit,cardName,cardNo){
    this.requestData.set_reqBody({
      userId:userId,
      bankName:bankName,
      bankDeposit:bankDeposit,
      cardName:cardName,
      cardNo:cardNo
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/bindBankCard",this.requestData);
  }

  /**
   * 图片上传
   */
  uploadImg (imgUrl){
    alert(imgUrl)
    let flag = false;
        let loading = this.commonUtil.loading('努力加载中···');
        let options: FileUploadOptions = {
          fileKey : 'fileObject',
          fileName: 'fileObject'
        }
        const fileTransfer: FileTransferObject = this.fileTransfer.create();
          fileTransfer.upload(imgUrl,this.appConfig.getUploadImgUrl(),options)
              .then((res)=> {
                alert(angular.toJson(res))
                if(angular.fromJson(res.response).retcode == AppConfig.responseCode.successCode){
                  this.commonUtil.toast_position("上传成功");
                  flag = true;
                }else{
                  this.commonUtil.toast_position(angular.fromJson(res.response).msg);
                }
                loading.dismiss();
                return flag;
        }).catch((error) => {
          this.commonUtil.toast_position("上传异常");
          loading.dismiss();
          return flag;
         })
        // 进度
        fileTransfer.onProgress((event) => {
          let downloadProgress = (event.loaded / event.total) * 100;
          loading.setContent("已经上传：" + Math.floor(downloadProgress) + "%");
          if (downloadProgress > 99) {
              loading.dismiss();
              flag = true;
              return flag;
          }
      });
  }

}
