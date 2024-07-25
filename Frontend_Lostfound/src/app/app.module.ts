import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LostItemsService, TipoService, ValoracionService, UserService } from './pages/LostItem/lost-item.service';
import { LostItemsListComponent } from './pages/LostItem/lost-item-list.component';
import { CreateLostItemComponent } from './pages/LostItem/create-lost-item.component';
import { FoundItemsService } from './pages/FoundItem/found-item.service';
import { FoundItemsListComponent } from './pages/FoundItem/found-item-list.component';
import { CreateFoundItemComponent } from './pages/FoundItem/create-found-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './pages/services/auth.service'; // Importa el AuthService
import { AuthGuard } from './pages/services/auth.guard'; // Importa el AuthGuard
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { LostItemDetailComponent } from './pages/LostItem/lost-item-detail.component'; // Importa LostItemDetailComponent
import { FoundItemDetailComponent } from './pages/FoundItem/found-item-detail.component'; // Importa LostItemDetailComponent
import { RatingModule } from 'ngx-bootstrap/rating'; // Importa RatingModule desde ngx-bootstrap
import { UserProfileComponent } from './pages/dashboard/user-profile.component'; // Importa UserProfileComponent
import { ReceivedRatingsComponent } from './pages/dashboard/received-ratings.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Nuevo módulo añadido

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CreateLostItemComponent,
    LostItemsListComponent,
    LostItemDetailComponent, // Agrega LostItemDetailComponent aquí
    CreateFoundItemComponent,
    FoundItemsListComponent,
    FoundItemDetailComponent,
    UserProfileComponent, // Agrega UserProfileComponent aquí
    ReceivedRatingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule, // Nuevo módulo añadido
    RatingModule.forRoot(), // Importa RatingModule desde ngx-bootstrap
    ToastrModule.forRoot({
      positionClass: 'toast-center',
    })
  ],
  providers: [
    LostItemsService,
    FoundItemsService,
    TipoService,
    ValoracionService,
    UserService,
    AuthService,
    AuthGuard,
    provideAnimationsAsync() // Asegúrate de registrar AuthGuard aquí
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
