import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRecordPage } from './account-record';

@NgModule({
  declarations: [
    AccountRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountRecordPage),
  ],
})
export class AccountRecordPageModule {}
