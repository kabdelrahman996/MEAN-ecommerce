import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: false,
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input() title: String = '';
  @Input() select: string = '';
  @Input() data: any[] = [];
  @Input() all: boolean = true;
  @Output()
  selectedValue = new EventEmitter();
  detectChanges(event: any) {
    this.selectedValue.emit(event);
  }
}
