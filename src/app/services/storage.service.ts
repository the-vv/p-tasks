import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { EStorageKeys } from '../models/storage.model';
import { ICategory, ITask } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor(
    private storage: Storage,
    private commonService: CommonService
  ) { }

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

  public async addTask(task: ITask) {
    try {
      let tasks: ITask[] = await this.storage.get(EStorageKeys.tasks);
      if (!tasks) {
        tasks = [];
      }
      const taskExists = tasks.find((taskItem) => (taskItem.name === task.name && taskItem.categoryId === task.categoryId));
      if (taskExists) {
        this.commonService.showToast('Task already exists');
        return false;
      }
      tasks.push(task);
      await this.storage.set(EStorageKeys.tasks, tasks);
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTask(taskId: string) {
    try {
      let tasks: ITask[] = await this.storage.get(EStorageKeys.tasks);
      if (!tasks) {
        return false;
      }
      tasks = tasks.filter((task) => task.id !== taskId);
      await this.storage.set(EStorageKeys.tasks, tasks);
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async updateTask(task: ITask) {
    try {
      let tasks: ITask[] = await this.storage.get(EStorageKeys.tasks);
      if (!tasks) {
        return;
      }
      const taskExists = tasks.find((taskItem) => (taskItem.name === task.name && taskItem.id !== task.id && taskItem.categoryId === task.categoryId));
      if (taskExists) {
        this.commonService.showToast('Task already exists');
        return false;
      }
      tasks = tasks.map((taskItem) => {
        if (taskItem.id === task.id) {
          return task;
        }
        return taskItem;
      });
      await this.storage.set(EStorageKeys.tasks, tasks);
      return true;
    } catch (error) {
      throw error;
    }
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
