import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRupeeFormatDirective]',
  standalone: true,
})
export class RupeeFormatDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let value = this.el.value;

    // Remove non-digit and non-decimal characters
    value = value.replace(/[^0-9.]/g, '');

    // Split integer and decimal parts
    let [intPart, decimalPart] = value.split('.');

    if (intPart) {
      let lastThree = intPart.slice(-3);
      let otherNumbers = intPart.slice(0, -3);
      if (otherNumbers !== '') lastThree = ',' + lastThree;
      intPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    }

    if (decimalPart !== undefined) {
      decimalPart = decimalPart.slice(0, 2); // max 2 decimals
      this.el.value = intPart + '.' + decimalPart;
    } else {
      this.el.value = intPart;
    }
  }

  @HostListener('blur')
  onBlur() {
    let value = this.el.value;
    if (value.endsWith('.')) {
      this.el.value = value.slice(0, -1);
    }
  }
}
