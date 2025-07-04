import { Routes } from '@angular/router';
import { FichasListComponent } from './feature/Fichas/fichas-list/fichas-list.component';

export const routes: Routes = [
    
    {
        path: "Fichas",
        component: FichasListComponent
    },

    {
        path: "",
        pathMatch: 'full',
        redirectTo: "Fichas"
    }


];
