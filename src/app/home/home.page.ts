import { ChangeDetectorRef, Component, computed, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { ICategory } from '../models/tasks.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel],
  providers: [
    StorageService
  ]
})
export class HomePage {

  public categories = signal<ICategory[]>([]);
  public selectedCategory = signal<string | null>(null);

  constructor(private storage: StorageService, private crd: ChangeDetectorRef) { }

  ionViewDidEnter() {
    this.storage.getCategories().then((categories) => {
      this.categories.set(categories);
      this.crd.detectChanges();
      this.selectedCategory.set(categories[0].id);
    }).catch((error) => {
      console.error(error);
      // TODO show toast
    })
  }

  public segmentChanged(event: CustomEvent) {
    console.log(event.detail.value);
  }

}
