import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyGoodsPage } from './my-goods';

@NgModule({
  declarations: [
    MyGoodsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyGoodsPage),
  ],
})
export class MyGoodsPageModule {}
