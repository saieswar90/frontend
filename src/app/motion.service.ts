import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private apiUrl = 'https://myserver-1.onrender.com/motion';  // API endpoint for motion data

  constructor(private http: HttpClient) { }

  // Fetch the motion data from the backend
  getMotionData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
