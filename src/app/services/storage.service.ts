import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { EStorageKeys } from '../models/storage.model';
import { ICategory, ITask } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(private storage: Storage) { }

  public async init() {
    await this.storage.create();
    // check if storage is empty and add a default category
    const categories = await this.storage?.get(EStorageKeys.tasksCategories);
    if (!categories || categories.length === 0) {
      await this.storage.set(EStorageKeys.tasksCategories, [
        {
          id: uuidv4(),
          name: 'Default Matrix',
          color: 'primary',
          index: Number.MAX_SAFE_INTEGER,
        },
      ]);
    }
  }

  public async getCategories(): Promise<ICategory[]> {
    return await this.storage.get(EStorageKeys.tasksCategories)
    .catch((error) => {
      console.error(error);
      // TODO show toast
    })
  }

  public addTask(task: ITask) {
    this.storage.get(EStorageKeys.tasks).then((tasks) => {
      if (!tasks) {
        tasks = [];
      }
      tasks.push(task);
      this.storage.set(EStorageKeys.tasks, tasks);
    }).catch((error) => {
      console.error(error);
      // TODO show toast
    });
  }

  public getTasks(categoryId: string): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve, reject) => {
      this.storage.get(EStorageKeys.tasks).then((tasks: ITask[]) => {
        if (!tasks) {
          return resolve([]);
        }
        const tasksFiltered = tasks.filter((task) => task.categoryId === categoryId);
        resolve(tasksFiltered);
      }).catch((error) => {
        console.error(error);
        // TODO show toast
        return reject(error);
      });
    });
  }

}
