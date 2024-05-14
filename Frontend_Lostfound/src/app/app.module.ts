// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LostItemsService, TipoService } from './pages/LostItem/lost-item.service';
import { LostItemsListComponent } from './pages/LostItem/lost-item-list.component';
import { CreateLostItemComponent } from './pages/LostItem/create-lost-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './pages/services/auth.service'; // Importa el AuthService
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { LostItemDetailComponent } from './pages/LostItem/lost-item-detail.component'; // Importa LostItemDetailComponent

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CreateLostItemComponent,
    LostItemsListComponent,
    LostItemDetailComponent // Agrega LostItemDetailComponent aquí
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center',
    })
  ],
  providers: [
    LostItemsService,
    TipoService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
