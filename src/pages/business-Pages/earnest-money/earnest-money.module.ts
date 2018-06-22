import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EarnestMoneyPage } from './earnest-money';

@NgModule({
  declarations: [
    EarnestMoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(EarnestMoneyPage),
  ],
})
export class EarnestMoneyPageModule {}
