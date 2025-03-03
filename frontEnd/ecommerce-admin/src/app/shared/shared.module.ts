import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SelectComponent } from './components/select/select.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SpinnerComponent, SelectComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    DecimalPipe,
    ReactiveFormsModule,
  ],
  exports: [
    SpinnerComponent,
    SelectComponent,
    FormsModule,
    RouterModule,
    DecimalPipe,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
