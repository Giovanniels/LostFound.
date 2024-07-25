import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LostItemsListComponent } from './pages/LostItem/lost-item-list.component';
import { CreateLostItemComponent } from './pages/LostItem/create-lost-item.component';
import { LostItemDetailComponent } from './pages/LostItem/lost-item-detail.component';
import { FoundItemsListComponent } from './pages/FoundItem/found-item-list.component';
import { CreateFoundItemComponent } from './pages/FoundItem/create-found-item.component';
import { FoundItemDetailComponent } from './pages/FoundItem/found-item-detail.component';
import { UserProfileComponent } from './pages/dashboard/user-profile.component';
import { ReceivedRatingsComponent } from './pages/dashboard/received-ratings.component';
import { AuthGuard } from './pages/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'lost-items',
        component: LostItemsListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-lost-item',
        component: CreateLostItemComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'lost-item-detail/:id',
        component: LostItemDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'found-items',
        component: FoundItemsListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create-found-item',
        component: CreateFoundItemComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'found-item-detail/:id',
        component: FoundItemDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'received-ratings',
        component: ReceivedRatingsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
