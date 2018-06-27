import { Component } from '@angular/core';
import { Platform , App ,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events} from 'ionic-angular';
import { AppServiceProvider } from "../providers/app-service/app-service";
import { Network } from '@ionic-native/network';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { AppConfig } from "../app/appConfig";
import angular from 'angular';

@Component({
  templateUrl: 'app.html',
  providers:[
    Network,
    AppServiceProvider,
    LoginServiceProvider
  ]
})

export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(
    private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private events:Events,
    private app:App,
    private alertCtrl:AlertController,
    private appServiceProvider:AppServiceProvider,
    private network:Network,
    private loginServiceProvider:LoginServiceProvider
  ) {
    this.startNetDetect();
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      if(this.platform.is('android')){  //如果是android 检查更新  ios不用检查更新
        appServiceProvider.getCarVer()
          
      }
    });
    this.EventHandlers();
    this.getPublicKey();
  }

  private getPublicKey(){
    this.loginServiceProvider.getPublicKey("67b65daf6343e8070f43457511733f69")
                .then(res=>{
                  if(res.retcode == AppConfig.responseCode.successCode){
                      let publicKey = angular.fromJson(res.retObj).publicKey;
                      window.localStorage.setItem("publicKey",publicKey);
                  }
      });
  }

  private EventHandlers() {  //监听器
    this.events.subscribe('needLogin', () => {
        this.app.getRootNav().setRoot('LoginPage');
    });
  }

   // 开启网络监测  
   startNetDetect() {  
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {  
     this.alertCtrl.create({
         title: '提示',
         message: '未连接网络，连接后重新启动！',
         enableBackdropDismiss:false,
         buttons: [
           {
             text: '重启',
             handler: () => {            
               if(this.platform.is('android')){
                 this.platform.exitApp();
               }
             }
           },
           {
             text: '关闭',
             handler: () => {            
              }
             }
           ]
       }).present();
       //关闭
       disconnectSubscription.unsubscribe();
   })
  }





}
