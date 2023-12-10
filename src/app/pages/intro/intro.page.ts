import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnimationController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class IntroPage {

  @ViewChildren('animateItem', { read: ElementRef }) cardElements!: QueryList<ElementRef<HTMLIonCardElement>>;

  constructor(private animationCtrl: AnimationController) { }

  ionViewWillEnter() {
    this.animateIntro();
  }

  private animateIntro() {
    const animations = this.cardElements.map((card, index) => {
      return this.animationCtrl.create()
        .addElement(card.nativeElement)
        .duration(400)
        .iterations(1)
        .fromTo('transform', 'translateY(50px) scale(0.9)', 'translateY(0px) scale(1)')
        .fromTo('opacity', '0', '1')
        .easing('ease-out')
        .delay((index + 1) * 100);
    });
    animations.forEach((animation) => animation.play());
  }

}
