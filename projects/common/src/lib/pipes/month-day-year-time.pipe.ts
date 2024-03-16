import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

@Pipe({ standalone: true, name: 'monthDayYearTime' })
export class MonthDayYearTimePipe implements PipeTransform {
  transform(value: string | number | Date) {
    try {
      return datePipe.transform(value, 'MM/dd/YYYY hh:mm aa');
    } catch (error: any) {
      return value;
    }
  }
}
