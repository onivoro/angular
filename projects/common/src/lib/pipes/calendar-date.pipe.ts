import { Pipe, PipeTransform } from '@angular/core';
const iso8601Regex = /\d{4}-\d{2}-\d{2}/;

@Pipe({ standalone: true, name: 'calendarDate' })
export class CalendarDatePipe implements PipeTransform {
  transform(value: string) {
    try {
      if (iso8601Regex.test(value)) {
        const [date] = value.split('T');
        const [y, m, d] = date.split('-');
        return `${m}/${d}/${y}`;
      }

      return value;
    } catch (error: any) {
      return value;
    }
  }
}

