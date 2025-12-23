import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }
  constructor(public http: HttpClient) {} // HttpClient já vai funcionar
}
