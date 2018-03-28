import { Component, OnInit, ViewChild } from '@angular/core';
import { NgFor, NgIf } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Project } from '../Models/project-info';
import { CardList } from '../Models/cardlist-info';

import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

@Component({

    templateUrl: 'app/Components/department.component.html',
    styleUrls: ['app/Styles/project.component.css']

})

export class DepartmentComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    projects: Project[];
    cardLists: CardList[];
    //La variable de abajo sirve como indicador, para decirnos cual modificar.
    project: Project;
    msg: string;
    msg2: string;
    empl: any[] = [];
    indLoading: boolean = false;
    departmentFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    projectname: string;
    cardlistname: string;
    cardlistcolor: string;
    cardlistorder: number;

    toShowAddProject: boolean;
    toShowAddCardList: boolean;

    constructor(private fb: FormBuilder, private _userService: UserService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {

        this.departmentFrm = this.fb.group({
            Id: [''],
            name: ['', Validators.required],
            created_at: ['', Validators.required],

        });

        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            //tal vez prodria hacer the department u user fueran valores del servicio.
            .subscribe(projects => { console.log(projects); this.projects = projects; this.indLoading = false; },
            error => this.msg = <any>error,
            () => {
                this.project = this.projects[0];
                this.LoadCardLists();
            });


        

    }

    LoadDeparts(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            //tal vez prodria hacer the department u user fueran valores del servicio.
            .subscribe(projects => { console.log(projects); this.projects = projects; this.indLoading = false; },
            error => this.msg = <any>error);

    }

    LoadCardLists(): void {
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(cardlist => {
                this.cardLists = cardlist;
                this.cardLists = this.cardLists.filter((cardlist: any) => cardlist.projectId == this.project.Id);
                //console.log("Sin orden: "+this.cardLists)
                this.cardLists.sort((orderA, orderB): number => orderA.orders - orderB.orders);
                //console.log("Tras orden: "+this.cardLists)
                //tal vez meter aqui el LoadIds()
            },
            error => this.msg = <any>error,
            () => {
                console.log(this.cardLists);
            }//Deberiamos poner algo aqui?
            );
    }

    addDepart() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Nuevo Usuario";
        this.modalBtnTitle = "Agregar";
        this.departmentFrm.reset();
        this.modal.open();
    }

    editDepart(id: number) {
       
    }

    deleteDepart(id: number) {
        
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.departmentFrm.enable() : this.departmentFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";
        this.msg2 = "";

        let vr: boolean = true;

        //this.projects.forEach(key => {
        //    if (formData._value.name.toUpperCase().trim() == key['name'].toUpperCase().trim())
        //        if (key['Id'] != formData._value.Id)
        //            vr = false;
        //})

        if (vr) {
                formData._value.created_at = "Mon Feb 20 2017 20:08:59 GMT+0200 (GTB Standard Time)";
            switch (this.dbops) {
                case DBOperation.create:
                    this._userService.post(Global.BASE_PROJECT_ENDPOINT, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "Departamento añadido correctamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas para guardar los datos!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._userService.put(Global.BASE_PROJECT_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El departamento se ha actualizado exitosamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas para guardar los datos!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._userService.delete(Global.BASE_PROJECT_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El departamento se ha borrado exitosamente.";
                                this.LoadDeparts();
                            }
                            else {
                                this.msg = "Hay problemas al guardar las modificaciones hechas!"
                            }

                            this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;

            }
        }
        else
            this.msg2 = "Ese departamento ya existe, por favor, escoja otro nombre"
    }

    styles() {
        let sty = `width:${100 / this.cardLists.length}%; float: left`;
        return this.sanitizer.bypassSecurityTrustStyle(sty);
    }

    showAddProject() {
        this.projectname = '';
        this.toShowAddProject = true;
    }
    //Ocultar modal project
    cancelAddProject() {
        this.toShowAddProject = false;
    }
    //Mostrar modal cardlist
    showAddCardList() {
        this.cardlistname = '';
        this.cardlistcolor = '';
        this.cardlistorder = this.cardLists.length;
        this.toShowAddCardList = true;
    }
    //Ocultar modal cardlist
    cancelAddCardList() {
        this.toShowAddCardList = false;
    }

    onChange(val: any) {
        this.project = val;
        //this.exportService.projectExp = val;
        this.LoadCardLists();
        // this.exportService.setJsonExport();
    }

}