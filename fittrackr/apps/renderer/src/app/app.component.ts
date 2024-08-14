import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppModule } from './app.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

@Component({
  standalone: true,
  imports:
    [
      RouterModule,
      AppModule,
    ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fitTrackr';
}
