import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  public url: string;

  constructor(
    private http: HttpClient
  ) {
      this.url = global.url;
    }

  sendEmail(email):Observable<any>
  {
    let params = JSON.stringify(email);
    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'send', params, { headers: headers });
    

    
  }
  

}
