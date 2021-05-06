import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'a',
        data: { pageTitle: 'qMapGatewayApp.a.home.title' },
        loadChildren: () => import('./a/a.module').then(m => m.AModule),
      },
      {
        path: 'c',
        data: { pageTitle: 'qMapGatewayApp.c.home.title' },
        loadChildren: () => import('./c/c.module').then(m => m.CModule),
      },
      {
        path: 'e',
        data: { pageTitle: 'qMapGatewayApp.e.home.title' },
        loadChildren: () => import('./e/e.module').then(m => m.EModule),
      },
      {
        path: 'd',
        data: { pageTitle: 'qMapGatewayApp.d.home.title' },
        loadChildren: () => import('./d/d.module').then(m => m.DModule),
      },
      {
        path: 'b',
        data: { pageTitle: 'qMapGatewayApp.b.home.title' },
        loadChildren: () => import('./b/b.module').then(m => m.BModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
