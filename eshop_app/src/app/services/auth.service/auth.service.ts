import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface UserInfo {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  user: UserInfo;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ){}

  register(body: {name: string; email: string; password: string}): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.config.apiUrl}/api/Auth/register`, body)
      .pipe(catchError(err => this.handleError(err)));
  }

  setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  //Приватный метод сервиса, который разбирает ошибку HTTP и превращает её в поток с одной ошибкой
  //HttpErrorResponse - тип ошибки от HttpClient в ангуляре: там есть статус, ошибка в иде тела ответа сервера и так далее.
  //Observable<never> - означает, что этот поток ничего успешного не выдаст, а только завершитсчя ошибкой
  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'Ошибка сети или сервера';
     return throwError(() => new Error(message));
  }
}
