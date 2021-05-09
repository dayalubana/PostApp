import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
@Component({
    selector:'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
    isAuthenticated = false;
    constructor(private auth: AuthService){}
    ngOnInit(){
        this.isAuthenticated = this.auth.getAuthStatus();
        this.auth.getAuthStatusUpdate()
        .subscribe((res)=>{
            this.isAuthenticated = res;
        })
    }

    onLogout(){
        this.auth.logout();
    }
}