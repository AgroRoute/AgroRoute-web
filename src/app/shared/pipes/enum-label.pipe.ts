import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumLabel',
  standalone: true,
})
export class EnumLabelPipe implements PipeTransform {
  transform(value: string, enumObj: Record<string, string>): string {
    return enumObj[value] ?? value;
  }
}