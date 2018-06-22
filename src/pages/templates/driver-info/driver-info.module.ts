import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverInfoPage } from './driver-info';

@NgModule({
  declarations: [
    DriverInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverInfoPage),
  ],
})
export class DriverInfoPageModule {}
