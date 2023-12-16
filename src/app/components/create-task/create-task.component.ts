import { CommonModule } from '@angular/common';
import { OnDestroy, Component, OnInit, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Capacitor } from "@capacitor/core";

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  @Input() public categoryId!: string;
  @Input({ required: true }) public modelRef!: IonModal;
  protected creationSelectedGridIndex: number | null = null;
  public showValidation = false;
  public taskNameControl = new FormControl<string>('', Validators.required);

  constructor(
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    if (Capacitor.isPluginAvailable('Keyboard')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.modelRef.setCurrentBreakpoint(1);
      });
      Keyboard.addListener('keyboardWillHide', () => {
        this.modelRef.setCurrentBreakpoint(0.5);
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
      this.showValidation = true;
      return;
    }
    this.storageService.addTask({
      id: uuidv4(),
      name: this.taskNameControl.value!,
      categoryId: this.categoryId,
      isCompleted: false,
      matrix: this.creationSelectedGridIndex,
    });
    this.modelRef.dismiss(true);
  }

}
