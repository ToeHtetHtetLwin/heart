import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-cutequestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cutequestion.component.html',
  styleUrls: ['./cutequestion.component.css']
})
export class CutequestionComponent implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @ViewChild('noButton') noButton!: ElementRef;
  
  isAccepted = false;
  private scene = new THREE.Scene();
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private emojis: THREE.Sprite[] = [];

  ngAfterViewInit() {
    this.initThreeJS();
    this.animateEntrance();
  }

  // Background က ပစ္စည်းလေးတွေ လွင့်နေအောင် လုပ်တာ
  private initThreeJS() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    const emojiList = ['🍩', '✨', '💖', '⭐', '🍭'];
    
    emojiList.forEach((symbol) => {
      for (let i = 0; i < 4; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.font = '50px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10);
        sprite.scale.set(0.8, 0.8, 1);
        this.scene.add(sprite);
        this.emojis.push(sprite);
      }
    });

    this.camera.position.z = 12;

    const animate = () => {
      requestAnimationFrame(animate);
      this.emojis.forEach((e, i) => {
        e.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
      });
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animateEntrance() {
    gsap.from(".glass-card", { duration: 1, scale: 0.8, opacity: 0, ease: "back.out(1.7)" });
  }

  // --- No Button Logic ---
  runAway() {
    const btn = this.noButton.nativeElement;
    const padding = 50; // ဘောင်နဲ့ ကပ်မသွားအောင် ပေးထားတဲ့ gap

    // ခလုတ်ရဲ့ Size ကို တိုင်းတာ
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;

    // ပြေးလို့ရမယ့် Safe Area ကို တွက်တာ (Screen Size - Button Size)
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    // Random နေရာ အသစ်ရှာမယ်
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    // GSAP နဲ့ smooth ဖြစ်အောင် နေရာရွှေ့မယ်
    gsap.to(btn, {
      left: randomX,
      top: randomY,
      x: 0, // Reset existing transforms
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  }

  onYes() {
    this.isAccepted = true;
    this.celebrate();
  }

  private celebrate() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff1493']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff1493']
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }
}