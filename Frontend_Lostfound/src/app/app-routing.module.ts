import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LostItemsListComponent } from './pages/LostItem/lost-item-list.component';
import { CreateLostItemComponent } from './pages/LostItem/create-lost-item.component'; // Importa el componente para crear elementos perdidos
import { LostItemDetailComponent } from './pages/LostItem/lost-item-detail.component'; // Importa el componente para los detalles del objeto perdido

const routes: Routes = [
  {
    path:'',
    redirectTo : 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'lost-items',
        component: LostItemsListComponent
      },
      {
        path:'create-lost-item', // Ruta para la creación de elementos perdidos
        component: CreateLostItemComponent // Componente para la creación de elementos perdidos
      },
      {
        path: 'lost-item-detail/:id', // Ruta para los detalles de un objeto perdido específico
        component: LostItemDetailComponent // Componente para mostrar los detalles del objeto perdido
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
