import { Injectable } from '@angular/core';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public showToast(text: string, long = false) {
    Toast.show({
      text,
      duration: long ? 'long' : 'short',
    })
  }

}
