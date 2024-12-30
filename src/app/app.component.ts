import { Component, inject, OnInit } from '@angular/core';

import { AvailablePlacesComponent } from './places/available-places/available-places.component';
import { UserPlacesComponent } from './places/user-places/user-places.component';
import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    AvailablePlacesComponent,
    UserPlacesComponent,
    ErrorModalComponent,
    NgIf,
  ],
})
export class AppComponent implements OnInit {
  private errorService = inject(ErrorService);
  error = '';

  ngOnInit() {
    this.errorService.error.subscribe((message) => {
      this.error = message;
    });
  }
}
