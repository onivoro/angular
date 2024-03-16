import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
const _currencyPipe = new CurrencyPipe('en-US');

@Pipe({ standalone: true, name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: any) {
    try {
      const number = Number(value);

      if (number || (number === 0)) {
        return _currencyPipe.transform(value);
      }

      return value;
    } catch (error: any) {
      return value;
    }
  }
}

