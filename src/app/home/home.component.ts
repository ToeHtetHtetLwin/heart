import { Component, viewChild, ElementRef, signal } from '@angular/core';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styles: [`
    :host {
      display: block;
      touch-action: none; 
      -webkit-user-select: none;
      user-select: none;
    }
    .press-btn {
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-touch-callout: none; /* Prevents context menu on iOS */
    }
  `]
})
export class HomeComponent {
  maskRect = viewChild<ElementRef>('maskRect');
  loveMessage = viewChild<ElementRef>('loveMessage');
  
  statusText = signal('လက်ဗွေရာတင်ပါ');
  percent = signal(0);
  tl?: gsap.core.Timeline;

  onStartPress(event: Event) {
    // Prevent default behaviors (like zooming or scrolling) on mobile
    if (event.cancelable) event.preventDefault();
    
    if (event instanceof MouseEvent && event.button !== 0) return;
    
    this.statusText.set('ခဏစောင့်ပါ...');

    if (this.tl) this.tl.kill();

    this.tl = gsap.timeline({
      onUpdate: () => {
        const progress = Math.round(this.tl!.progress() * 100);
        this.percent.set(progress);
      },
      onComplete: () => this.showLoveMessage()
    });

    this.tl.to(this.maskRect()?.nativeElement, {
      attr: { y: 0 },
      duration: 3,
      ease: "power1.inOut"
    });
  }

  onEndPress() {
    if (this.tl && this.tl.progress() < 1) {
      this.tl.reverse();
      this.statusText.set('လက်ဗွေရာတင်ပါ');
    }
  }

  showLoveMessage() {
    this.statusText.set('COMPLETED');
    this.launchConfetti();

    gsap.to(this.loveMessage()?.nativeElement, {
      opacity: 1,
      scale: 1.1,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  }

  launchConfetti() {
    const end = Date.now() + 3000;
    const colors = ['#FF0000', '#D00000', '#FF4D4D'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}