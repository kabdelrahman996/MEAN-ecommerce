import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user/user.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule],
})
export class UserModule {}
