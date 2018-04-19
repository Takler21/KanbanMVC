import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { routing } from './app.routing';
import { DepartmentComponent } from './components/department.component';
import { CardListComponent } from './Components/cardlist.component';
import { CardComponent } from './Components/card.component';
import { UserService } from './Service/user.service';
import { DndModule } from 'ng2-dnd';
import { AlertModule } from "ngx-bootstrap";
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule, routing, Ng2Bs3ModalModule, FormsModule, AlertModule.forRoot(), ModalModule.forRoot(), DndModule.forRoot()],
    declarations: [AppComponent, DepartmentComponent, CardListComponent, CardComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UserService],
    bootstrap: [AppComponent]
})

export class AppModule { }