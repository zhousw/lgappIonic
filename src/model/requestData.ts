import { Md5 } from "ts-md5";
import angular from 'angular';

export class RequestData {
    reqHead : reqHead
    reqBody: any
    reqKey: string
    constructor(){
        let _token = window.localStorage.getItem("_token");
        let userInfo = angular.fromJson(window.localStorage.getItem("userInfo"));
        if( ! this.isNull(_token)){
            this.reqHead = new reqHead(_token,userInfo.type,userInfo.id);
        }else{
            this.reqHead = new reqHead("","1","0");
        }
        this.reqBody = {};
    }

    get_reqHead() {
        return this.reqHead;
    }

    set_reqHead(token: string,userType: string,id: string) {
       this.reqHead = new reqHead(token,userType,id);
       return this.reqHead;
    }

    get_reqBody() {
        return this.reqBody;
    }

    set_reqBody(_reqBody: any) {  //set_reqBody() 时，同时生成reqKey，
        this.reqBody = _reqBody;
        this.reqKey = Md5.hashStr(angular.toJson(this.reqHead) + encodeURIComponent(angular.toJson(this.reqBody))+"_"+this.reqHead._token).toString();
    }

    get_reqKey() {
        return this.reqKey;
    }

    set_reqKey(_reqKey: string) {
        this.reqKey = _reqKey;
    }

    private isNull (data){
        if(data == null || data == ''){
            return true;
        }else{
            return false;
        }
    }

}
    class reqHead{
        _token: string
        _userType: string
        _id: string

        constructor( token: string,userType: string, id: string){
            this._token = token;
            this._userType = userType;
            this._id = id;
        }

        public get token() {
            return this._token;
        }
        public set token(_token:string){
            this._token = _token;
        }

        public get userType() {
            return this._userType;
        }
        public set userType(_userType:string){
            this._userType = _userType;
        }

        public get id() {
            return this._id;
        }
        public set id(_id:string){
            this._id = _id;
        }

    }