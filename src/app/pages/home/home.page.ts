import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ICategory } from '../../models/tasks.model';
import { IonicModule } from '@ionic/angular';
import { AppConfigPipe } from 'src/app/pipes/app-config.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, AppConfigPipe, CommonModule],
  providers: [
    StorageService
  ],
})
export class HomePage implements AfterViewInit {

  @ViewChild('matrixContainer', { read: ElementRef }) matrixContainer!: ElementRef<HTMLDivElement>;

  public categories = signal<ICategory[]>([]);
  public selectedCategory = signal<string | null>(null);
  public matrixLists: {
    [key: number]: ICategory[]
  } = {
    0: [],
    1: [],
    2: [],
    3: [],
  }

  constructor(private storage: StorageService, private crd: ChangeDetectorRef) {
    effect(() => {
      console.log(this.selectedCategory());
    }, { allowSignalWrites: true })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // make sure the matrix is centered
      const element = this.matrixContainer.nativeElement;
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
      element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
    });
  }

  ionViewDidEnter() {
    this.storage.getCategories().then((categories) => {
      this.categories.set(categories);
      this.crd.detectChanges(); // using because of segment should be updated before selectedCategory is set
      this.selectedCategory.set(categories[0].id);
    }).catch((error) => {
      console.error(error);
      // TODO show toast
    });
  }

  public segmentChanged(event: CustomEvent) {
    console.log(event.detail.value);
  }

  public scrollIntoView(card: any) {
    if (card?.el) {
      card.el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public getVisibleDimensions(divId: string) {
    const element = document.getElementById(divId);
    if (element) {
      const rect = element.getBoundingClientRect();
      // Calculate visible dimensions by subtracting the area outside the viewport
      const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return { visibleWidth, visibleHeight };
    }
    return null;
  }


}
