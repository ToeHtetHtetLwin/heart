import { Component, ElementRef, OnInit, ViewChild, signal, computed } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-zootopia-scene',
  standalone: true,
  templateUrl: './zootopia-scene.component.html',
  styleUrls: ['./zootopia-scene.component.css']
})
export class ZootopiaSceneComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  slides = [
    { gif: 'cp.gif', text: 'You know you love me...' },
    { gif: 'c1.jpg', text: 'I do? Yes, I do!' },
    { gif: 'c2.jpg', text: 'Better Together Forever.' },
    { gif: 'c3.jpg', text: 'You are my life' },
    { gif: 'c4.jpg', text: 'Cannot live without u' },
    { gif: 'c5.png', text: 'Miss u so much' }
  ];

  currentIndex = signal(0);
  currentSlide = computed(() => this.slides[this.currentIndex()]);

  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private heartMesh!: THREE.Mesh; 
  private stars!: THREE.Points;
  private emojiHearts: THREE.Sprite[] = [];
  // Floating hearts အတွက် ပန်းရောင် emoji များ
  private heartEmojis = ['💖', '💗', '💓', '💓', '💕', '💓'];

  ngOnInit() {
    this.initThree();
    this.addLighting(); 
    this.create3DBackground();
    this.drawThickHeartDrawing(); 
    this.createFloatingEmojiHearts();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  nextSlide() {
    this.currentIndex.update(val => (val + 1) % this.slides.length);
    this.restartHeartDrawing();
  }

  private initThree() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = window.innerWidth < 768 ? 25 : 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // အလယ်ကအသည်းပုံအတွက် Red Point Light
    const redLight = new THREE.PointLight(0xff0000, 6, 60);
    redLight.position.set(0, 0, 10);
    this.scene.add(redLight);
    
    // ပတ်ဝန်းကျင်အတွက် Pink Point Light
    const pinkLight = new THREE.PointLight(0xff1493, 3, 50);
    pinkLight.position.set(10, 10, 5);
    this.scene.add(pinkLight);
  }

  private create3DBackground() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 900;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 150;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    // ကြယ်ပွင့်များကို Pink အရောင်ထားသည်
    const starMat = new THREE.PointsMaterial({ size: 0.16, color: 0xff69b4, transparent: true, opacity: 0.6 });
    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  private drawThickHeartDrawing() {
    const points: THREE.Vector3[] = [];
    const heartScale = window.innerWidth < 768 ? 0.75 : 0.95;

    for (let t = 0; t <= Math.PI * 2.01; t += 0.05) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      points.push(new THREE.Vector3(x * heartScale, y * heartScale, 0));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.45, 8, false);
    
    // Heart ကိုပဲ Pure Red ထားသည်
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 3.5,
      shininess: 200,
      transparent: true,
      opacity: 0
    });

    this.heartMesh = new THREE.Mesh(geometry, material);
    this.heartMesh.position.z = 0; 
    
    this.scene.add(this.heartMesh);
    this.restartHeartDrawing();
  }

  private restartHeartDrawing() {
    if (!this.heartMesh) return;
    const mat = this.heartMesh.material as THREE.MeshPhongMaterial;
    const geo = this.heartMesh.geometry as THREE.TubeGeometry;

    mat.opacity = 0;
    const drawParams = { factor: 0 };

    gsap.to(mat, { opacity: 1, duration: 0.4 });
    
    gsap.fromTo(drawParams, 
      { factor: 0 }, 
      { 
        factor: 1, 
        duration: 2.2, 
        ease: "power2.inOut",
        onUpdate: () => {
          const totalPoints = geo.index ? geo.index.count : 0;
          geo.setDrawRange(0, totalPoints * drawParams.factor);
        }
      }
    );
  }

  private createEmojiTexture(emoji: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 64; canvas.height = 64;
    context.font = '50px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    // Emoji Glow ကို Pink အရောင်ထားသည်
    context.shadowColor = 'rgba(255, 20, 147, 1)';
    context.shadowBlur = 12;
    context.fillText(emoji, 32, 32);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createFloatingEmojiHearts() {
    for (let i = 0; i < 35; i++) {
      const emoji = this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)];
      const material = new THREE.SpriteMaterial({ map: this.createEmojiTexture(emoji), transparent: true, opacity: 0.75 });
      const sprite = new THREE.Sprite(material);
      sprite.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20);
      sprite.scale.set(1.3, 1.3, 1);
      
      sprite.userData['speedY'] = Math.random() * 0.03 + 0.015;
      sprite.userData['speedX'] = (Math.random() - 0.5) * 0.01;
      
      this.emojiHearts.push(sprite);
      this.scene.add(sprite);
    }
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.heartMesh) {
      this.heartMesh.rotation.y += 0.01;
      this.heartMesh.position.y = Math.sin(Date.now() * 0.0015) * 0.3;
    }
    
    if (this.stars) this.stars.rotation.y += 0.0005;
    
    this.emojiHearts.forEach(s => {
      s.position.y += s.userData['speedY'];
      s.position.x += s.userData['speedX'];
      if (s.position.y > 30) {
        s.position.y = -30;
        s.position.x = (Math.random() - 0.5) * 60;
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }
}