/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@bluebits/products';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import * as countries from 'i18n-iso-countries';

declare const require: (arg0: string) => countries.LocaleData;


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  apiURLUsers = environment.apiURL + 'users';

  constructor(private http: HttpClient) {
    countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get(`${this.apiURLUsers}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  getCountries(): { id: string; name: string}[] {
    return Object.entries(countries.getNames('en', { select: 'official' })).map((entry) => {
      console.log('entry', entry)
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countries.getName(countryKey, 'en');
  }
}
