import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/Models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

   Login(formData: User )
   {
     return this.http.post(environment.baseUrl+"/api/Login/Post",formData);
   }
}
