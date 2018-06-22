import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { CommonServiceProvider } from "../providers/common-service/common-service";
import { CommonUtil } from "../utils/commonUtil";
import { AppConfig } from "../app/appConfig";
import {WechatChenyu} from "wechat-chenyu";
import { FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '返回',
      iconMode: 'ios',
      mode:'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonServiceProvider,
    CommonUtil,
    AppConfig,
    WechatChenyu,
    FileTransfer,
    FileTransferObject

  ]
})
export class AppModule {}
