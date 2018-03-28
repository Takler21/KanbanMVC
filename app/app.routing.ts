import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './components/user.component';
import { DepartmentComponent } from './components/department.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'kanban', pathMatch: 'full' },
    { path: 'user', component: UserComponent },
    { path: 'kanban', component: DepartmentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);