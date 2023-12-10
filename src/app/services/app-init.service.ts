import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { setupIcons } from '../configs/icons';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private storageService: StorageService,
  ) { }

  public async initApp() {
    setupIcons();
    await this.storageService.init();
  }

}
