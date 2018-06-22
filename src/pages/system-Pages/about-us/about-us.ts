import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  title = '关于我们';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  

}
