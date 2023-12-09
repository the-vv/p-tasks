import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private storageState: Storage | null = null;

  constructor(private storage: Storage) { }

  public async init() {
    this.storageState = await this.storage.create();
  }

}
