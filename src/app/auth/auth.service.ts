import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {environment} from '../../environments/environment'
const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({providedIn: 'root'})
export class AuthService{
    private token;
    private isAuthenticated = false;
    private authStatusUpdate = new Subject<boolean>();
    private authTimer: any;
    private userId = null;

    constructor(private http: HttpClient, private router: Router){}

    addUser(user){
        console.log(user);
        this.http.post(BACKEND_URL + '/signup', user)
        .subscribe((res) => {
            this.router.navigate(['/auth/login']);
        }, (err) => {
            this.authStatusUpdate.next(false);
        });
    }

    getAuthStatusUpdate(){
        return this.authStatusUpdate.asObservable();
    }

    login(user){
        this.http.post<{message: string, token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', user)
        .subscribe((res) => {
            const token = res.token;
            this.token = token;
            if (token){
                this.isAuthenticated = true;
                this.authStatusUpdate.next(true);
                this.setAuthTimer(res.expiresIn);
                const now = new Date();
                this.userId = res.userId;
                const expirationDate = new Date(now.getTime() + res.expiresIn * 1000);
                this.saveAuthData(res.token, expirationDate, res.userId);
                this.router.navigate(['/']);
            }
        }, (err) => {
            this.authStatusUpdate.next(false);
        });
    }

    logout(){
        this.isAuthenticated = false;
        this.authStatusUpdate.next(false);
        clearTimeout(this.authTimer);
        this.userId = null;
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
    }

    autoAuthUser(){
        const userInfo = this.getAuthData();
        const now = new Date();
        const expiresIn = userInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0){
            this.token = userInfo.token;
            this.userId = userInfo.userId;
            this.isAuthenticated = true;
            this.authStatusUpdate.next(true);
            this.setAuthTimer(expiresIn / 1000);
        }
    }

    setAuthTimer(duration){
        console.log('Setting Timer', duration);
        this.authTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    getAuthStatus(){
        return this.isAuthenticated;
    }

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId;
    }

    saveAuthData(token, expirationDate: Date, userId){
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
    }
    clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
    }
    getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expirationDate');
        const userId = localStorage.getItem('userId');
        return {
            token,
            expirationDate: new Date(expirationDate),
            userId
        };
    }
}
