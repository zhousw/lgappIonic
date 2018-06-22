import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonUtil } from '../../../utils/commonUtil';
import { AppConfig } from '../../../app/appConfig';
import { UserServiceProvider } from "../../../providers/user-service/user-service";

@IonicPage()
@Component({
  selector: 'page-bank-info',
  templateUrl: 'bank-info.html',
  providers:[
    UserServiceProvider
  ]
})
export class BankInfoPage {

  userInfo = this.appConfig.getUserInfo()
  private bankForm : FormGroup;
  constructor(
    public navCtrl: NavController,
    private formBuilder:FormBuilder,
    private commonUtil:CommonUtil,
    private appConfig:AppConfig,
    private userServiceProvider:UserServiceProvider
  ) {
    this.bankForm=this.formBuilder.group({
      bankName:['',Validators.required],
      cardName:['',Validators.required],
      cardNo:['',Validators.required]
    });

  }

  closeModal(){
    this.navCtrl.pop();
  }

  modifyBank(values){
    if( ! this.bankForm.valid){
      this.commonUtil.toast_position("请检查所填信息",'bottom');
      return;
    }
    this.userServiceProvider.bindBankCard(this.userInfo.id,values.bankName,values.bankName,values.cardName,values.cardNo)
      .then(res=>{
        if(res.retcode == AppConfig.responseCode.successCode){
          // this.commonUtil.parseData(res.retObj)
                this.commonUtil.toast_position("修改成功",'middle');
                // window.localStorage.removeItem("userInfo");  这边也要重新返回用户信息
                // window.localStorage.setItem("userInfo",res.retObj);
                // this.userInfo = res.retObj
                this.closeModal();
        }
      })
  }

}
