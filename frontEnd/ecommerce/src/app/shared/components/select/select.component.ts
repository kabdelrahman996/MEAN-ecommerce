import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: false,

  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input() title: String = '';
  @Input() data: any[] = [];
  @Output() selectedValue = new EventEmitter();
  detectChanges(event: any) {
    this.selectedValue.emit(event);
  }
}
