import { Injectable } from '@angular/core';
import { CommonServiceProvider } from "../common-service/common-service";
import { AppConfig } from "../../app/appConfig";
import { RequestData } from "../../model/requestData";

@Injectable()
export class AppServiceProvider {

  private requestData = new RequestData();
  constructor(
    private commonServiceProvider:CommonServiceProvider,
    private appConfig:AppConfig
  ) {}

  getCarVer (){
    this.requestData.set_reqBody({})
    this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/getCarVer",this.requestData)
    .then(res=>{
      if(res.retcode == AppConfig.responseCode.successCode){
        alert(res.retObj)
      }
    })      
  }

//   //检查更新
//   checkUpdate() {
//     try{
//         this.checkVersion().then(res=>{
//             if(res.isSuccess){
//                 let serverAppVersion = res.Data.version; //从服务端获取最新版本
//                 if(!this.appUtil.isNull(serverAppVersion)){
//                     //获取版本
//                     this.appVersion.getVersionNumber().then(version=>{
//                         //如果本地于服务端的APP版本不符合
//                         if (version != serverAppVersion) {
//                             this.showUpdateConfirm(res.Data.descInfo);
//                         }
//                     });
//                 }
//             }
//         },function(err){

//         });
//     }catch (e){
//         console.error(e);
//     }
// }


//   showUpdateConfirm(descInfo) {
//     this.alertCtrl.create({
//       title: '版本升级',
//       message: descInfo,
//       enableBackdropDismiss:false,
//       buttons: [
//         {
//           text: '升级',
//           handler: () => {            
//             let isAndroid = this.platform.is('android');
//                 if(isAndroid){
//                   let loadingStart = this.loadingCtrl.create({
//                     content: "开始下载",
//                   });
//                   loadingStart.present();

//                     let url = AppConfig.installPackageAddr; //可以从服务端获取更新APP的路径
//                     let targetPath = this.file.externalRootDirectory + "apa7kp.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
//                     let trustHosts = true;
//                     let options = {};
//                     const fileTransfer: FileTransferObject = this.fileTransfer.create();
//                     fileTransfer.download(url, targetPath,trustHosts, options).then(result=>{
//                         // 成功
//                         loadingStart.dismiss();
//                         // 打开下载下来的APP
//                         this.fileOpener.open(targetPath, 'application/vnd.android.package-archive')
//                     },  (error) => {
//                         this.appIonicUtil.toast('下载失败！');
//                         loadingStart.dismiss();
//                       }).catch(()=>{
//                         this.appIonicUtil.toast('下载失败！');
//                     });
//                         //进度
//                         let downloadProgress:number
//                         fileTransfer.onProgress((event) => {
//                         if (event.lengthComputable) {
//                           downloadProgress = event.loaded / event.total * 100;
//                         }
//                      });
//                       let timer = setInterval(() => {   //好像是js阻塞了线程，前端内容无法宣染，所以加了个定时器
//                       loadingStart.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
//                         if (downloadProgress >= 99) {
//                             clearInterval(timer);
//                         }
//                       }, 300);
//                 }
//               }
//             },
//             {
//               text: '残忍放弃',
//               handler: () => {            
                  
//               }
//             }
//           ]
//       }).present();
       
//     }

}
