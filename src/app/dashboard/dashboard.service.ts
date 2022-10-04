import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly apiURL : String;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }

  getYearsMultipleWinners() {
    return this.http.get(`${ this.apiURL }?projection=years-with-multiple-winners`).toPromise();
  }

  getStudiosWithWinCount() {
    return this.http.get(`${ this.apiURL }?projection=studios-with-win-count`).toPromise();
  }

  getMaxWinIntervalForProducer() {
    return this.http.get(`${ this.apiURL }?projection=max-min-win-interval-for-producers`).toPromise();
  }

  getMoviesByYear(filterValues: any) {
    const year = filterValues.year;
    return this.http.get(`${ this.apiURL }?&year=${ year }&winner=true`).toPromise();
  }



  
}
