import { Pipe, PipeTransform } from '@angular/core';
import { APP_CONFIGS } from '../configs/app-configs';

@Pipe({
  name: 'appConfig',
  standalone: true
})
export class AppConfigPipe implements PipeTransform {

  transform(value: keyof typeof APP_CONFIGS | null): any {
    if (!value) {
      return value;
    }
    return APP_CONFIGS[value] || value;
  }

}
