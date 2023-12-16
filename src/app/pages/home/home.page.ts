import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren, effect, signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ICategory, ITask } from '../../models/tasks.model';
import { IonCard, IonSegmentButton, IonicModule } from '@ionic/angular';
import { AppConfigPipe } from 'src/app/pipes/app-config.pipe';
import { CommonModule } from '@angular/common';
import { AnimationController } from '@ionic/angular/standalone';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';
import { TaskItemComponent } from 'src/app/components/task-item/task-item.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    AppConfigPipe,
    CommonModule,
    CreateTaskComponent,
    TaskItemComponent
  ],
  providers: [
    StorageService
  ],
})
export class HomePage implements AfterViewInit {

  @ViewChild('matrixContainer', { read: ElementRef }) matrixContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren(IonSegmentButton, { read: ElementRef }) segmentButtons!: QueryList<ElementRef<HTMLIonCardElement>>;
  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef<HTMLIonCardElement>>;
  private categoriesAnimationPlayed = false;
  public categories = signal<ICategory[]>([]);
  public selectedCategory = signal<string | null>(null);
  public matrixLists: { [key: number]: ITask[]; reset: () => void } = {
    0: [],
    1: [],
    2: [],
    3: [],
    reset() {
      this[0] = [];
      this[1] = [];
      this[2] = [];
      this[3] = [];
    }
  };

  constructor(
    private storage: StorageService,
    private crd: ChangeDetectorRef,
    private animationCtrl: AnimationController
  ) {
    effect(() => {
      if (this.categories().length > 0 && !this.categoriesAnimationPlayed) {
        this.segmentButtons.forEach((card, index) => {
          this.animationCtrl.create()
            .addElement(card.nativeElement)
            .duration(400)
            .iterations(1)
            .fromTo('transform', 'translateY(50px) scale(0.9)', 'translateY(0px) scale(1)')
            .fromTo('opacity', '0', '1')
            .easing('ease-out')
            .delay((index + 1) * 50)
            .play();
        });
        this.categoriesAnimationPlayed = true;
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // make sure the matrix is centered
      const element = this.matrixContainer.nativeElement;
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
      element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
    });

    this.cards.forEach((card, index) => {
      this.animationCtrl.create()
        .addElement(card.nativeElement)
        .duration(400)
        .iterations(1)
        .fromTo('transform', this.getCardFromTo(index), 'translate(0px, 0px) scale(1)')
        .fromTo('opacity', '0', '1')
        .easing('ease-out')
        .play();
    })
  }

  getCardFromTo(index: number) {
    switch (index) {
      case 0:
        return 'translate(-10px, -10px) scale(0.9)';
      case 1:
        return 'translate(10px, -10px) scale(0.9)';
      case 2:
        return 'translate(-10px, -10px) scale(0.9)';
      case 3:
        return 'translate(10px, 10px) scale(0.9)';
      default:
        return 'translateY(10px, 10px) scale(0.9)';
    }
  }

  ionViewDidEnter() {
    this.storage.getCategories().then((categories) => {
      this.categories.set(categories);
      this.crd.detectChanges(); // using because of segment should be updated before selectedCategory is set
      this.selectedCategory.set(categories[0].id);
      this.getTasks();
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

  public onModalClosed(event: any) {
    if (event.detail.data) {
      this.getTasks();
    }
  }

  private getTasks() {
    this.storage.getTasks(this.selectedCategory()!)
      .then((tasks) => {
        this.matrixLists.reset();
        tasks.forEach((task) => {
          this.matrixLists[task.matrix].push(task);
        });
      }).catch((error) => {
        console.error(error);
        // TODO show toast
      });
  }

}
