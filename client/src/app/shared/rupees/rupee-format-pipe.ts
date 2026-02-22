import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupeeFormat',
})
export class RupeeFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null || value === '') return '';

    // Convert to number with 2 decimal places
    const num = parseFloat(value.toString()).toFixed(2);
    const x = num.split('.');

    let intPart = x[0];
    let lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);

    if (otherNumbers !== '') lastThree = ',' + lastThree;

    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    // Add ₹ symbol in front
    return '₹' + formatted + '.' + x[1];
  }
}
