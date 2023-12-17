import { CommonModule } from '@angular/common';
import { OnDestroy, Component, OnInit, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Capacitor } from "@capacitor/core";
import { CommonService } from 'src/app/services/common.service';
import { ITask } from 'src/app/models/tasks.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class CreateTaskComponent implements OnInit, OnDestroy {

  @Input() public task: ITask | null = null;
  @Input() public categoryId!: string;
  @Input({ required: true }) public modelRef!: IonModal;
  protected creationSelectedGridIndex: number | null = null;
  public showValidation = false;
  public taskNameControl = new FormControl<string>('', Validators.required);
  public isUpdate = false;
  public validationMessages = '';

  constructor(
    private storageService: StorageService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    if (this.task) {
      this.isUpdate = true;
      this.taskNameControl.setValue(this.task.name);
      this.creationSelectedGridIndex = this.task.matrix;
    }
    if (Capacitor.isPluginAvailable('Keyboard')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.modelRef.setCurrentBreakpoint(1);
      });
      Keyboard.addListener('keyboardWillHide', () => {
        this.modelRef.setCurrentBreakpoint(0.6);
      });
    }
  }

  ngOnDestroy(): void {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      Keyboard.removeAllListeners();
    }
  }

  public onCreate() {
    if (!this.taskNameControl.valid || this.creationSelectedGridIndex === null) {
      this.validationMessages = '';
      if (!this.taskNameControl.valid) {
        this.validationMessages = 'Enter task name';
      }
      if (this.creationSelectedGridIndex === null) {
        this.validationMessages = this.validationMessages ? `${this.validationMessages} and choose priority` : 'Choose priority';
      }
      this.showValidation = true;
      return;
    }
    if (this.isUpdate) {
      this.storageService.updateTask({
        ...this.task!,
        name: this.taskNameControl.value!,
        matrix: this.creationSelectedGridIndex
      }).then((response) => {
        if (!response) {
          return;
        }
        this.commonService.showToast('Task updated successfully');
      })
    } else {
      this.storageService.addTask({
        id: uuidv4(),
        name: this.taskNameControl.value!,
        categoryId: this.categoryId,
        isCompleted: false,
        matrix: this.creationSelectedGridIndex,
        createdAt: Date.now()
      }).then((response) => {
        if (!response) {
          return;
        }
        this.commonService.showToast('Task created successfully');
      })
    }
    this.modelRef.dismiss(true);
  }

}
