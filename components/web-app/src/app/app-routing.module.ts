import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictComponent } from './pages/predict/predict.component';
import { CalcComponent } from './pages/calc/calc.component';

const routes: Routes = [
  {
    path: 'calc',
    component: CalcComponent,
  },
  {
    path: 'predict',
    component: PredictComponent,
  },
  {
    path: '**',
    redirectTo: 'calc',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
