import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LostItemsListComponent } from './pages/LostItem/lost-item-list.component';
import { CreateLostItemComponent } from './pages/LostItem/create-lost-item.component'; // Importa el componente para crear elementos perdidos
import { LostItemDetailComponent } from './pages/LostItem/lost-item-detail.component'; // Importa el componente para los detalles del objeto perdido
import { UserProfileComponent } from './pages/dashboard/user-profile.component';
import { ReceivedRatingsComponent } from './pages/dashboard/received-ratings.component';

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
      },
      {
        path: 'user-profile', // Ruta para el perfil de usuario
        component: UserProfileComponent // Componente para el perfil de usuario
      },
      {
        path: 'received-ratings', // Ruta para el perfil de usuario
        component: ReceivedRatingsComponent // Componente para el perfil de usuario
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
