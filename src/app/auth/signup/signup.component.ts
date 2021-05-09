import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
    isLoading = false;
    authStatus: Subscription;
    constructor(private auth: AuthService){}

    ngOnInit(){
        this.authStatus = this.auth.getAuthStatusUpdate().subscribe(res => {
            this.isLoading = false;
        });
    }

    onSignup(form){
        if (form.invalid){
            return;
        }
        this.isLoading = true;
        this.auth.addUser(form.value);
        form.reset();
    }
    ngOnDestroy(){
        this.authStatus.unsubscribe();
    }
}
