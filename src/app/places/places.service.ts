import { inject, Injectable } from '@angular/core';
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

const apiUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private userPlaces = new BehaviorSubject<Place[]>([]);
  loadedUserPlaces = this.userPlaces.asObservable();

  constructor(private httpClient: HttpClient) {}

  loadAvailablePlaces() {
    return this.fetchPlaces(
      `${apiUrl}/places`,
      'Something bad happened. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      `${apiUrl}/user-places`,
      'Something bad happened. Please try again later.'
    ).pipe(
      tap({
        next: (resp: any) => {
          this.userPlaces.next(resp.places);
        },
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const currentPlaces = this.userPlaces.getValue();

    if (!currentPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.next([...currentPlaces, place]);
    }

    return this.httpClient
      .put(`${apiUrl}/user-places`, {
        placeId: place.id,
      })
      .pipe(
        catchError((err) => {
          this.userPlaces.next(currentPlaces);
          this.errorService.showError('Failed to store selected user.');
          return throwError(() => new Error('Failed to store selected user.'));
        })
      );
  }

  removeUserPlace(place: Place) {
    const currentPlaces = this.userPlaces.getValue();
    const updatedPlaces = currentPlaces.filter((p) => p.id !== place.id);
    this.userPlaces.next(updatedPlaces);

    return this.httpClient.delete(`${apiUrl}/user-places/${place.id}`).pipe(
      catchError((err) => {
        this.userPlaces.next(currentPlaces);
        this.errorService.showError('Failed to remove selected place.');
        return throwError(() => new Error('Failed to selected place.'));
      })
    );
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
