import { Routes } from '@angular/router';
import { SorryComponent } from './sorry/sorry.component';
import { ZootopiaSceneComponent } from './zootopia-scene/zootopia-scene.component';

export const routes: Routes = [
  // 1. Match the dynamic ID (e.g., localhost:4200/anniversary/cust-001)
  { 
    path: '', 
    component: SorryComponent
  },

  
];