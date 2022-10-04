import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  readonly apiURL : String;
  
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }

  getMovies(currentPage: number, pageSize: number, filterValues: any) {
    const year = filterValues.year;
    const winner = filterValues.winner;
    return this.http.get(`${ this.apiURL }?page=${ currentPage }&size=${ pageSize }&year=${ year }&winner=${ winner }`).toPromise();
  }
}
