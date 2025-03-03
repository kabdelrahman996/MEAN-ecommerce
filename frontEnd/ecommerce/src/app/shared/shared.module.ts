import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SelectComponent } from './components/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SpinnerComponent, SelectComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgbAlertModule,
    RouterModule,
    DecimalPipe,
    ReactiveFormsModule,
  ],
  exports: [
    SpinnerComponent,
    SelectComponent,
    FormsModule,
    NgbAlertModule,
    RouterModule,
    DecimalPipe,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
