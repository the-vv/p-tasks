import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ICategory } from '../../models/tasks.model';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [
    StorageService
  ],
})
export class HomePage {

  public categories = signal<ICategory[]>([]);
  public selectedCategory = signal<string | null>(null);

  constructor(private storage: StorageService, private crd: ChangeDetectorRef) {
  }

  ionViewDidEnter() {
    this.storage.getCategories().then((categories) => {
      this.categories.set(categories);
      this.crd.detectChanges(); // using because of segment should be updated before selectedCategory is set
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
