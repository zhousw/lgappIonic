import { Injectable } from '@angular/core';
import { CommonServiceProvider } from "../common-service/common-service";
import { AppConfig } from "../../app/appConfig";
import { RequestData } from "../../model/requestData";

@Injectable()
export class LockServiceProvider {

  private requestData = new RequestData();
  constructor(
    private commonServiceProvider : CommonServiceProvider,
    private appConfig:AppConfig
  ) {}

  /**
   * 查询在途锁记录
   */
  queryRoadLockOrder(userId,currentPage){
      this.requestData.set_reqBody({
        userId:userId,
        currentPage:currentPage
      })
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryRoadLockOrder",this.requestData);
  }

  /**
   * 用锁记录查询
   */
  qryLockOrder(userId,currentPage,startTime,endTime){
    this.requestData.set_reqBody({
        userId:userId,
        currentPage:currentPage,
        container_no:'',
        order_no:'',
        lock_no:'',
        startTime:startTime,
        endTime:endTime
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryLockOrder",this.requestData);
  }

  /**
   * 查询自有锁
   */
  qryOwnLock(userId){
      this.requestData.set_reqBody({
        userId:userId
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/qryOwnLock",this.requestData);
  }

  /**
   * 删除自有锁
   */
  delOwnLock(userId,lock_no){
      this.requestData.set_reqBody({
        userId:userId,
        lock_no:lock_no
      })
      return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/delOwnLock",this.requestData);
  }

  /**
   * 添加自有锁
   */
  addOwnLock(userId,lock_no,lock_name){
    this.requestData.set_reqBody({
      userId:userId,
      lock_no:lock_no,
      lock_name:lock_name
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/addOwnLock",this.requestData);
  }

  /**
   * 更换锁号
   */
  chgRoadLockNo(userId,old_lock_no,new_lock_no){
    this.requestData.set_reqBody({
      userId:userId,
      old_lock_no:old_lock_no,
      new_lock_no:new_lock_no
    })
    return this.commonServiceProvider.HttpPost(this.appConfig.getRootUrl()+"/chgRoadLockNo",this.requestData);
  }
}
