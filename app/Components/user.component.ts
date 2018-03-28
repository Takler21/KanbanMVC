import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUser } from '../Models/user';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

@Component({

    templateUrl: 'app/Components/user.component.html'

})

export class UserComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    users: IUser[];
    user: IUser;
    id_dep: any[] = [];
    ids: any[] = [];
    msg: string;
    msg2: string;
    indLoading: boolean = false;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    prueba: any[] = [];
    keysID: any[] = [];
    hola: string;

    constructor(private fb: FormBuilder, private _userService: UserService) { }

    ngOnInit(): void {

        this.userFrm = this.fb.group({
            Id: [''],
            FirstName: ['', Validators.required],
            LastName: [''],
            Gender: [''],
            Id_Depart: ['']
        });

        this.LoadUsers();
        //Tal vez el loadIds tenga que ir dentro del loadUsers por usar peticiones asincronas ambas,
        //aunque en principio no deberia tener problema debido a que son independientes.
        this.LoadIds();

    }


    LoadUsers(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USER_ENDPOINT)
            .subscribe(users => {
                this.users = users; this.indLoading = false;
                //tal vez meter aqui el LoadIds()
            },
            error => this.msg = <any>error,
            () => {
                console.log(this.users)
            this.users.forEach(key => {
                if (!this.id_dep[key['Id_Depart']])
                    this.id_dep[key['Id_Depart']] = key['Id_Depart']
            });
        });

    }

    //Para comprobar que el id que se pasa como parametro del departamento exite y evitar el errores.
    LoadIds(): void {
        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            .subscribe(ids => {
                this.ids = ids;
                this.ids.forEach(key => {
                    this.prueba[key['Id']] = key['Id'];
                });
                this.keysID = Object.keys(this.prueba);
                console.log(this.keysID);
                },
                error => this.msg = <any>error);

    }

    addUser() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Nuevo Usuario";
        this.modalBtnTitle = "Agregar";
        this.userFrm.reset();
        this.modal.open();
    }

    editUser(id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Usuario";
        this.modalBtnTitle = "Actualizar";
        this.user = this.users.filter(x => x.Id == id)[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    }

    deleteUser(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Borrar?";
        this.modalBtnTitle = "Borrar";
        this.user = this.users.filter(x => x.Id == id)[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    }

    //Activa o desactiva el form modal.
    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }

    //tal vez meter aqui el LoadIds(), en el onSubmit()
    onSubmit(formData: any) {
        this.msg = "";
        this.msg2 = "";


        if (this.prueba[formData._value.Id_Depart] || formData._value.Id_Depart == "" || formData._value.Id_Depart == null) {
            this.hola = "hola";
            //Comprobacion de IDs
            switch (this.dbops) {
                case DBOperation.create:
                    this._userService.post(Global.BASE_USER_ENDPOINT, formData._value).subscribe(
                        data => {
                            //Alternativa!

                            if (data == 1) //Success
                            {
                                this.msg = "Usuario añadido correctamente.";
                                this.LoadUsers();
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
                    this._userService.put(Global.BASE_USER_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El usuario se ha actualizado exitosamente.";
                                this.LoadUsers();
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
                    this._userService.delete(Global.BASE_USER_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "El usuario se ha borrado exitosamente.";
                                this.LoadUsers();
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
        else {
            this.msg2 = "El departamento con esa id no existe";
        }
    }

}