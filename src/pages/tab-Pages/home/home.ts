import { Component } from '@angular/core';
import { NavController,Tabs, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "陆港物流";

  constructor(public navCtrl: NavController,private tabs:Tabs) {

  }

  goLock(){
   this.tabs.select(2);

  }

}
