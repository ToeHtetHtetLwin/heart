import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  // 1. Match the dynamic ID (e.g., localhost:4200/anniversary/cust-001)
  { 
    path: '', 
    component:HomeComponent
  },

  
];