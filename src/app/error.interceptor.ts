import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorINterceptor implements HttpInterceptor{
    constructor(private dialog: MatDialog){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                let message = 'An unknown error occured|';
                if (err.error.message){
                    message = err.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message}});
                return throwError(err);
            })
        );
    }
}
