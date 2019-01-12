import { Injectable } from '@angular/core';
import { RequestData } from '../../model/requestData';
import { CommonServiceProvider } from "../common-service/common-service";
import { AppConfig } from "../../app/appConfig";

@Injectable()
export class PayServiceProvider {
 
  private requestData = new RequestData();
  constructor(
    private commonServiceProvider : CommonServiceProvider,
    private appConfig:AppConfig
  ) {}

  /**
   * 保证金变动列表查询接口 
   */
  qryDepositRecord(userId,currentPage,startTime,endTime){
    this.requestData.set_reqBody({
      userId:userId,
      currentPage:currentPage,
      startTime:startTime,
      endTime:endTime
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryDepositRecord",this.requestData);
  }

  /**
   * 余额变动列表查询接口
   */
  qryBalnceAmount(userId,currentPage,startTime,endTime){
      this.requestData.set_reqBody({
        userId:userId,
        currentPage:currentPage,
        startTime:startTime,
        endTime:endTime
      })
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryBalnceAmount",this.requestData);
  }

  /**
   * 查询 我的余额,挣的钱,锁押金
   */
  qryBalance(userId){
    this.requestData.set_reqBody({
      userId:userId
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryBalance",this.requestData);
  }

  /**
   * 查询单锁押金数和使用费用
   */
  qryDepositAndPrice(userId){
    this.requestData.set_reqBody({
      userId:userId
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryDepositAndPrice",this.requestData);
  }

  /**
   * 生成锁订单
   * @param userId 
   * @param lock_no 
   * @param lock_type 0自有锁，1租用锁
   * @param use_time 
   * @param container_no 箱号
   */
  createLockOrder(userId,lock_no,lock_type,container_no){
    this.requestData.set_reqBody({
      userId:userId,
      lock_no:lock_no,
      lock_type:lock_type,
      container_no:container_no
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/createLockOrder",this.requestData);
  }

  /**
   * 支付锁订单
   * @param userId 
   * @param balance_amount 用余额支付的金额
   * @param pay_amount 微信支付的金额
   * @param order_no 
   */
  payLockOrder(userId,balance_amount,pay_amount,order_no){
    this.requestData.set_reqBody({
      userId:userId,
      balance_amount:balance_amount,
      pay_amount:pay_amount,
      order_no:order_no,
      pay_type:'MWEB'
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/payLockOrder",this.requestData);
  }

  /**
   * 判断保证金是否充足
   */
  checkLock(userId, lock_no){
    this.requestData.set_reqBody({
      userId:userId,
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/checkLockSts",this.requestData);
  }

  /**
   * 充值接口
   */
  chargeAmount(userId,amount,amount_type) {
    this.requestData.set_reqBody({
      userId:userId,
      amount:amount,
      amount_type:amount_type,
      pay_type:'APP'
    })
    return this.commonServiceProvider.HttpGet(this.appConfig.getRootUrl()+"/chargeAmount",this.requestData);
  }
}
