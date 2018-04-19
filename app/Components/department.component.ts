import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgFor, NgIf } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Project } from '../Models/project-info';
import { CardList } from '../Models/cardlist-info';
import { SubCardList } from '../Models/subcardlist-info';
import { Card } from '../Models/card-info';

import { DBOperation } from '../Shared/enum';
import { Global } from '../Shared/global';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
@Component({

    templateUrl: 'app/Components/department.component.html',
    styleUrls: ['app/Styles/project.component.css']

})

export class DepartmentComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    projects: Project[];
    cardLists: CardList[];

    project: Project;
    msg: string;
    msg2: string;
    indLoading: boolean = false;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    projectname: string;
    cardlistname: string;
    cardlistcolor: string;
    cardlistorder: number;

    toShowAddProject: boolean;
    toShowAddCardList: boolean;

    css_color_names = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];


    syncro: boolean;
    deleteObservable: Observable<any>;

    constructor(private fb: FormBuilder, private _userService: UserService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {

        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            //tal vez prodria hacer the department u user fueran valores del servicio.
            .subscribe(projects => { console.log(projects); this.projects = projects; this.indLoading = false; },
            error => this.msg = <any>error,
            () => {
                this.project = this.projects[0];
                this.LoadCardLists();
                this._userService.syncro.subscribe(syn => {
                    this.syncro = syn;
                    console.log(this.syncro + " Es el syn");
                    if (this.syncro) {
                        this._userService.syncro.next(false);
                        this.LoadCardLists();
                    }
                });
            });

    }

    LoadProjects(): void {
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

    changeOrders(mod: boolean, rders: number) {
        var cardL = this.cardLists.filter((cardlist: any) => cardlist.orders >= rders);
        console.log(cardL);
        console.log("Longitud: " + cardL.length)
        if (cardL.length > 1) {
            cardL.forEach(l => {
                if (mod) {
                    console.log("Orden: " + l.orders);
                    l.orders++;
                    console.log("Orden: " + l.orders);
                }
                else {
                    console.log("Orden: " + l.orders);
                    l.orders--;
                    console.log("Orden: " + l.orders);
                }
                if ((mod && l.orders == this.cardLists.length) || (!mod && l.orders == this.cardLists.length - 2))
                    this._userService.put(Global.BASE_CARDLIST_ENDPOINT, l.Id, l).subscribe(data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Se modifico el Orden Del Ultimo";
                            console.log(this.msg)
                            console.log(cardL);

                        }
                        else {
                            this.msg = "problemas para Cambiar el Orden!"
                        }
                    },
                        error => {
                            this.msg = error;
                        },
                        () => { this.LoadCardLists() })
                else
                    this._userService.put(Global.BASE_CARDLIST_ENDPOINT, l.Id, l).subscribe(data => {
                        if (data == 1) //Success
                        {
                            this.msg = "Se modifico correctamente el orden de un elemento";
                            console.log(this.msg)
                            console.log(cardL);

                        }
                        else {
                            this.msg = "No se modifico correctamente le orden de un elemento";
                        }
                    },
                        error => {
                            this.msg = error;
                        })

            })
        }
        else
            this.LoadCardLists();
    }

    editDepart(id: number) {

    }

    deleteProject() {
        this._userService.get(Global.BASE_PROJECT_ENDPOINT).subscribe(dat => {
            this.cardLists.forEach(calist => {
                this.deleteCardlist(calist);
            });
        },
            error => this.msg = error,
            () => {
                this._userService.delete(Global.BASE_PROJECT_ENDPOINT, this.project.Id).subscribe(() => {
                    let indice: number;
                    indice = this.projects.findIndex(x => x.Id == this.project.Id);
                    this.projects.splice(indice, 1);
                    if (indice == this.projects.length)
                        indice = indice - 1;
                    console.log("Entro al delete project la parte final.    " + indice);
                    this.project = this.projects[indice];
                    //.splice(tasks.findIndex(x => x.Id == tk.Id), 1)
                });
            })
    }

    styles() {
        let sty = `width:${100 / this.cardLists.length}%; float: left`;
        return this.sanitizer.bypassSecurityTrustStyle(sty);
    }

    showAddProject() {
        this.projectname = '';
        this.toShowAddProject = true;
    }

    saveAddProject() {
        let created_at = new Date().toString();
        this._userService.post(Global.BASE_PROJECT_ENDPOINT, { name: this.projectname, created_at: created_at })
            .subscribe(() => { this.LoadProjects(); this.cancelAddProject(); });
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

    saveAddCardList() {
        this._userService.post(Global.BASE_CARDLIST_ENDPOINT, { name: this.cardlistname, color: this.cardlistcolor, orders: this.cardlistorder, created_at: 'Hoy', projectId: this.project.Id })
            .subscribe(() => this.changeOrders(true, this.cardlistorder));
    }

    //Ocultar modal cardlist
    cancelAddCardList() {
        this.toShowAddCardList = false;
    }

    deleteCardlist(cardList: CardList) {
        console.log("cardlist: " + cardList)
        console.log("cardlist: " + cardList.Id)

        var subVerification: SubCardList[];
        let noVacio = false;
        this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
            .subscribe((sub: SubCardList[]) => {
                subVerification = sub.filter((subcardL: SubCardList) => subcardL.cardlistId == cardList.Id);
                console.log("subcardlist: " + subVerification)

                if (subVerification.length > 0) {

                    subVerification.forEach(s => {
                        this._userService.get(Global.BASE_CARDS_ENDPOINT).subscribe(
                            (data: Card[]) => {
                                console.log("primer lote cartas: " + data.filter((card: Card) => card.cardListId == s.Id && card.parent == 's'));

                                if (data.filter((card: Card) => card.cardListId == s.Id && card.parent == 's').length > 0)
                                    noVacio = true;
                            }
                        )
                    })
                }
                else {

                    this._userService.get(Global.BASE_CARDS_ENDPOINT).subscribe(
                        (data: Card[]) => {
                            console.log("segundo lote cartas: " + data.filter((card: Card) => card.cardListId == cardList.Id && card.parent == 'c'));

                            if (data.filter((card: Card) => card.cardListId == cardList.Id && card.parent == 'c').length > 0)
                                noVacio = true;
                        })
                }
            },
            error => { this.msg = error; console.log(this.msg) },
            () => {
                console.log("Entra")
                if (noVacio)
                    alert("Por Favor vacie la lista de cartas");
                else {
                    console.log("Entra")
                    if (subVerification.length > 0) {
                        subVerification.forEach((s, index) => {
                            this._userService.delete(Global.BASE_SUBCARDLIST_ENDPOINT, s.Id).subscribe(
                                () => {
                                    if (index == subVerification.length - 1)
                                        this._userService.delete(Global.BASE_CARDLIST_ENDPOINT, cardList.Id)
                                            .subscribe(() => {
                                                console.log("Se borraron los datos tras borrar los subcardlist");
                                                this.changeOrders(false, cardList.orders);
                                            });
                                }
                            )
                        });
                    }
                    else {
                        this._userService.delete(Global.BASE_CARDLIST_ENDPOINT, cardList.Id)
                            .subscribe(() => {
                                console.log("Se borraron los datos del cardlist sin subcardlists");
                                this.changeOrders(false, cardList.orders);
                            })
                    }

                }
            });

    }

    onChange(val: any) {
        console.log(val);
        this.project = val;
        //this.exportService.projectExp = val;
        this.LoadCardLists();
        // this.exportService.setJsonExport();
    }

    updateOnDrop(ev: any) {
        console.log("Detecto el movimient de particulas")
        //
        console.log("Detecto el movimient de particulas")
    }

}