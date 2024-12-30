import {
  Component,
  DestroyRef,
  inject,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnChanges {
  // places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error: any;
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places: Place[] = [];

  apiUrl = 'http://localhost:3000';

  ngOnInit() {
    this.placesService.loadedUserPlaces.subscribe((places) => {
      this.places = places;
    });

    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
      error: (err) => {
        this.error = err.message;
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ngOnChanges() {
    console.log(this.places, 'userPlaces');
  }

  onRemovePlace(place: Place) {
    const subscription = this.placesService.removeUserPlace(place).subscribe({
      error: (err) => {
        this.error = err.message;
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
