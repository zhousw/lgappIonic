import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayOfLockPage } from './pay-of-lock';

@NgModule({
  declarations: [
    PayOfLockPage,
  ],
  imports: [
    IonicPageModule.forChild(PayOfLockPage),
  ],
})
export class PayOfLockPageModule {}
