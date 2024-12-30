import {
  Component,
  DestroyRef,
  inject,
  Inject,
  OnInit,
  signal,
} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error: any;
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  apiUrl = 'http://localhost:3000/places';

  ngOnInit() {
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (res) => {
        this.places.set(res.places);
      },
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

  onSelectPlace(place: Place) {
    // console.log(place);
    const subscription = this.placesService
      .addPlaceToUserPlaces(place)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
