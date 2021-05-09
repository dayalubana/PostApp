import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy{
    isLoading = false;

    authStatus: Subscription;
    constructor(private auth: AuthService){}

    ngOnInit(){
        this.authStatus = this.auth.getAuthStatusUpdate().subscribe(res => {
            this.isLoading = false;
        });
    }
    onLogin(form){
        if(form.invalid){
            return
        }
        this.isLoading = true;
        this.auth.login(form.value)
        form.reset();
    }
    ngOnDestroy(){
        this.authStatus.unsubscribe();
    }
}