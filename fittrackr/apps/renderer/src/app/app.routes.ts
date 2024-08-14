import { Route } from '@angular/router';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const appRoutes: Route[] = [
    {path: "profilPage", component: ProfilPageComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "**", component: ProfilPageComponent},
];
