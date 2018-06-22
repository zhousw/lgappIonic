import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarModalPage } from './car-modal';

@NgModule({
  declarations: [
    CarModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CarModalPage),
  ],
})
export class CarModalPageModule {}
