import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private storageService: StorageService,
  ) { }

  public async initApp() {
    await this.storageService.init();
  }

}
