import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate',
})
export class FormattedDatePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
