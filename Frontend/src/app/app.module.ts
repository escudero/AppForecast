import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { HotTableModule } from '@handsontable/angular';


import { HeaderComponent } from './header/header.component';
import { ForecastFormComponent } from './forecast-form/forecast-form.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForecastFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ChartsModule,
    HotTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
