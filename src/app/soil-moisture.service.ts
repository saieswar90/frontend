import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoilMoistureService {

  private apiUrl = 'https://myserver-1.onrender.com/digisoil'; // Your API URL for soil moisture data

  constructor(private http: HttpClient) {}

  // Fetch soil moisture data from the API
  getSoilMoistureData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}