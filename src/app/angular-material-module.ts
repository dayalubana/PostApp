import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
    exports: [
        MatInputModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
        MatCardModule,
        MatToolbarModule,
        MatExpansionModule,
        MatIconModule,
    ]
})
export class AngularMaterialModule{

}
