import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FaceTrackWebCamComponent } from './directives/facetracker/FaceTrackWebCamComponent';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FaceTrackWebCamComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
