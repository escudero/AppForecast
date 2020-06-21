import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  forecast(previous, model, params): Observable<any> {
    let API_URL = `${this.apiUrl}/forecast`;
    let data = {
      "data": previous,
      "model": model,
      "params": params
    }
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.error)
      )
  }

  // Handle Errors 
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  

}
