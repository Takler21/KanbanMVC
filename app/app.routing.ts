import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './components/department.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'kanban', pathMatch: 'full' },
    { path: 'kanban', component: DepartmentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);