import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictComponent } from './pages/predict/predict.component';

const routes: Routes = [
  {
    path: '',
    component: PredictComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
