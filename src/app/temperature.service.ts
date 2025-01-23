import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {

  private apiUrl = 'https://myserver-1.onrender.com/climate'; // Your API URL

  constructor(private http: HttpClient) {}

  // Fetch temperature data from the API
  getTemperatureData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}