import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLockPage } from './my-lock';

@NgModule({
  declarations: [
    MyLockPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLockPage),
  ],
})
export class MyLockPageModule {}
