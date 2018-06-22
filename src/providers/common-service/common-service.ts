import {Headers, Http, RequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';
import {CommonUtil} from "../../utils/commonUtil";
import * as $ from "jquery";
import {AppConfig} from "../../app/appConfig";
import {Events} from 'ionic-angular';
import {RequestData} from '../../model/requestData';

@Injectable()
export class CommonServiceProvider {
  constructor(
    private http: Http,
    private commonUtil:CommonUtil,
    private events:Events
  ) {}

  HttpPost(url,requestData:RequestData,Header?:Headers){
    if(this.commonUtil.isNull(Header)){
      Header = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    }
    return this.http.post(url,this.toBodyString({
        reqHead:requestData.get_reqHead(),
        reqBody:requestData.get_reqBody(),
        reqKey:requestData.get_reqKey()
    }),new RequestOptions({headers: Header}))
      .toPromise()
      .then(res => this.handleSuccess((res.json())))
      .catch(error => this.handleError(error))
    }

    HttpGet(url,requestData:RequestData,Header?:Headers){
      if(this.commonUtil.isNull(Header)){
        Header = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      }
      return this.http.get(url + "?" + this.toBodyString({
          reqHead:requestData.get_reqHead(),
          reqBody:requestData.get_reqBody(),
          reqKey:requestData.get_reqKey()
      }),new RequestOptions({headers: Header}))
        .toPromise()
        .then(res => this.handleSuccess((res.json())))
        .catch(error => this.handleError(error))
      }

    private handleSuccess(result) {
      if (result && (result.retcode != AppConfig.responseCode.successCode)) {  //由这里统一处理请求返回数据失败的情况
        this.commonUtil.toast_position(result.msg,'bottom');
      }
      if (result && (result.code == AppConfig.responseCode.needLogin)) {//为什么有-1000，又有-2 都需要登陆？
        this.events.publish('needLogin');
      }
      return result;
    }

    private handleError(error: Response | any) {
      let msg = '获取数据异常!';
      console.log(error)
      if (error.status == 0) {
        msg = '请求地址错误';
      }
      if (error.status == 400) {
        msg = '请求无效';
        console.log('请检查参数类型是否匹配');
      }
      if (error.status == 404) {
        msg = '请求资源不存在';
        console.error(msg+'，请检查路径是否正确');
      }
      this.commonUtil.toast_position(msg,'bottom'); //由这里统一处理error,不需要每次都catch
      console.log(error,msg);
      return {retcode: -1, msg: msg};
    }

    //http请求时对body数据的处理
    private  toBodyString(obj) {
      let ret = [];
      for (let key in obj) {
        key = encodeURIComponent($.trim(key));
        let values =obj[key];
        if (values && values.constructor == Array) {//数组
          let queryValues = [];
          for (let i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(this.toQueryPair(key, value));
          }
          ret = ret.concat(queryValues);
        } else if(typeof(values) == "object" &&
              Object.prototype.toString.call(values).toLowerCase() == "[object object]" ){ //json 对象
          ret.push(this.toQueryPair(key, JSON.stringify(values)));
        } else { //字符串
          ret.push(this.toQueryPair(key, values));
        }
      }
      return ret.join('&');
    }

    private  toQueryPair(key, value) {
      if (typeof value == 'undefined') {
        return key;
      }
      return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }

}
