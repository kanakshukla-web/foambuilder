import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RectangelComponent } from './components/rectangel/rectangel.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CircleComponent } from './components/circle/circle.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NgxMoveableModule } from 'ngx-moveable';
//import { NgxMoveableComponent } from 'ngx-moveable';
import {MatSliderModule} from '@angular/material/slider';
import { EjsShapeLibComponent } from './components/ejs-shape-lib/ejs-shape-lib.component';
import { EjsPhotoTracerComponent } from './components/ejs-photo-tracer/ejs-photo-tracer.component';
import { EjsDrawShapeComponent } from './components/ejs-draw-shape/ejs-draw-shape.component';
import { EjsFileHandlerComponent } from './components/ejs-file-handler/ejs-file-handler.component';
import { KonvaModule } from 'ng2-konva';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AccounthandlerComponent } from './components/accounthandler/accounthandler.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RectangelComponent,
    PropertiesComponent,
    SidenavComponent,
    NavbarComponent,
    CircleComponent,
    SettingsComponent,
    EjsShapeLibComponent,
    EjsPhotoTracerComponent,
    EjsDrawShapeComponent,
    EjsFileHandlerComponent,
    AccounthandlerComponent,
    //NgxMoveableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    DialogModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    NgxMoveableModule,
    MatSliderModule,
    KonvaModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    NgxUiLoaderModule,
    NgxSpinnerModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
