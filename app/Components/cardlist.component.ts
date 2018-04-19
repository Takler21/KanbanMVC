import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { CardList } from "../models/cardlist-info";
import { SubCardList } from "../models/subcardlist-info";
import { Card } from "../models/card-info";
import { Task } from "../models/task-info";

import { Global } from '../Shared/global';
import { UserService } from "../Service/user.service"

@Component({
    selector: 'cardlist',
    templateUrl: 'app/Components/cardlist.component.html',
    styleUrls: ['app/Styles/cardlist.component.css'],
})
export class CardListComponent implements OnInit {
    @Input() item: CardList;
    dropUpdate: EventEmitter<boolean> = new EventEmitter();
    msg: any;
    existSub: boolean;
    cardlistEmpty: boolean = true;
    cards: Card[]
    cardsSub: any[];
    subcardlists: SubCardList[];
    fatherIdCard: number;
    typeparent: string;
    toShowAddCard: boolean;
    editCard: Card;

    subcardlistname: string;
    toShowAddSubCardList: boolean;

    cardname: any;
    carddescription: any;
    allowedDropFrom: any[] = [];
    allowedDragTo = false;
    allowDropParent: any = [];


    constructor(private _userService: UserService) {
    }

    ngOnInit() {
        this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
            .subscribe(s => {
                //filter aqui.
                this.subcardlists = s.filter((subcardlist: any) => subcardlist.cardlistId == this.item.Id);//resultado del filtrado
                this.existSub = (this.subcardlists.length != 0);
                console.log(this.existSub);
            },
            error => this.msg = error,
            () => {
                if (!this.existSub) {
                    this.loadCards();
                }
                else {
                    this.loadCardsSub();
                }
                this.dropping();
            })
    }
    dropping() {
        //fill allowed drop-from containers

        //Usar item para el id del proyecto, con el que sacar 
        //los card list y filtrar o lo que sea por orden.
        //luego comprobar si el siguiente tiene subcardlist
        this.allowedDropFrom = [];
        var carp: Card[]
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(p => {
                carp = p.filter((cardlist: CardList) => cardlist.projectId == (this.item.projectId))
                //Esto en complete()
            },
            error => this.msg = error,
            () => {
                this.allowedDropFrom = [];
                carp.forEach(p1 => {
                    if (p1.orders == this.item.orders - 1) {
                        this.allowedDropFrom.push(p1.Id);
                        this.allowDropParent[p1.Id] = 'c';
                    }
                    console.log("cardlist normales: " + p1.Id)
                    //Hasta aqui permite el pase de cardlist normales
                });
                //Add subcardlists keys to allowedDropFrom variable.
                //this one add sublist in case the next cardlist has subcardlists
                this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
                    .subscribe(data => {
                        //aqui deberia hacer un foreach? MODIFICANDO
                        var sublist = data.filter((subcardlist: SubCardList) => subcardlist.cardlistId == (this.allowedDropFrom[0]))
                        if (sublist.length > 0 && this.item.orders != 0)
                            sublist.forEach((sub: SubCardList) => {
                                this.allowedDropFrom.push(sub.Id);
                                this.allowDropParent[sub.Id] = 's';
                                console.log("Sub permitidos de" + this.item.name + ": " + sub.Id)
                            })
                    },
                    error => this.msg = error,
                    () => {
                        //Let change card between subcardlist in the same card list
                        if (this.subcardlists && this.subcardlists.length > 0) {
                            this.subcardlists.forEach(sub => {
                                this.allowedDropFrom.push(sub.Id);
                                this.allowDropParent[sub.Id] = 's';
                            }
                            );
                        }
                    })

            });
        //fill if it has next containers
        //filtrar por order.
        //filtra tambien el projecto, para depejar los cardlist que 
        //no sean del proyecto pero tengan el mismo orden
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT)//
            .subscribe(d => {
                this.item.orders + 1
                var ordA = d.filter((cardlist: CardList) => cardlist.orders == (this.item.orders + 1))
                ordA = ordA.filter((cardlist: CardList) => cardlist.projectId == (this.item.projectId))
                if (ordA.length > 0 || this.existSub)
                    this.allowedDragTo = true;
            }
            );
    }

    loadCards() {
        this._userService.get(Global.BASE_CARDS_ENDPOINT)
            .subscribe(cards => {
                this.cards = cards.filter((cards: Card) => cards.cardListId == this.item.Id);
                this.cards = this.cards.filter((cards: Card) => cards.parent == 'c');
                console.log("cartas 1: " + Object.keys(this.cards))
            })
    }

    loadCardsSub() {
        this._userService.get(Global.BASE_CARDS_ENDPOINT)
            .subscribe(
            cards => {
                console.log("Cartas 3: " + cards)
                //en cards ya tenemos todas las cartas, solo hace falta
                //usar el bucle para cambiar el filtrado y guardar las 
                //cartas, como aun esta por decidirse.
                this.cardsSub = []
                this.subcardlists.forEach(sub => {
                    //Tal vez intentar poner al conjunto de cards una key
                    //como referencía al subcardlists.
                    this.cardsSub[sub.name] = (cards.filter((cards: Card) => cards.cardListId == sub.Id));
                    this.cardsSub[sub.name] = this.cardsSub[sub.name].filter((cards: Card) => cards.parent == 's');
                })
                console.log("cartas 2: " + Object.keys(this.cardsSub));
            })

    }

    deleteCard(card: Card) {
        var tasks: Task[];

        this._userService.get(Global.BASE_TASKS_ENDPOINT)
            .subscribe(c => {
                tasks = c.filter((task: Task) => task.cardId == card.Id);
                if (tasks.length < 1) {
                    this._userService.delete(Global.BASE_CARDS_ENDPOINT, card.Id).subscribe(() => {
                        if (!this.existSub) {
                            this.loadCards();
                        }
                        else {
                            this.loadCardsSub();
                        }
                    });
                }
                else {
                    tasks.forEach(tk =>
                        this._userService.delete(Global.BASE_TASKS_ENDPOINT, tk.Id).subscribe(
                            () => {
                                console.log(tasks + ", Antes, vacio?" + (tasks.length < 1));
                                tasks.splice(tasks.findIndex(x => x.Id == tk.Id), 1)
                                console.log(tasks + ", Despues vacio?" + (tasks.length < 1));
                                if (tasks.length < 1) {
                                    this._userService.delete(Global.BASE_CARDS_ENDPOINT, card.Id).subscribe(() => {
                                        if (!this.existSub) {
                                            this.loadCards();
                                        }
                                        else {
                                            this.loadCardsSub();
                                        }
                                    });
                                }

                            })
                    );
                }
            });

    }

    deleteSublist(subcardlist: SubCardList) {
        let sublistBigger: SubCardList[]
        let vacio: boolean;
        vacio = this.cardsSub.filter((card: Card) => card.cardListId == subcardlist.Id).length < 1
        if (vacio) {
            this._userService.delete(Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id)
                .subscribe(data => {
                    sublistBigger = this.subcardlists.filter((subcardl: SubCardList) => subcardl.orders > subcardlist.orders)
                    console.log(sublistBigger);
                    sublistBigger.forEach(sub => {
                        sub.orders = sub.orders - 1;
                        this._userService.put(Global.BASE_SUBCARDLIST_ENDPOINT, sub.Id, sub)
                            .subscribe()
                    });
                },
                error => { this.msg = error; console.log(this.msg) },
                () => {
                    this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
                        .subscribe(s =>
                            this.subcardlists = s.filter((subcardlist: any) => subcardlist.cardlistId == this.item.Id),
                        error => this.msg = error,
                        () => {
                            this.loadCardsSub()
                        })
                })
        }
    }

    clickCarret(subcardlist: any) {
        subcardlist.isExpanded = !subcardlist.isExpanded;
        this._userService.put(Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id, subcardlist).subscribe(
            data => {
                if (data == 1) //Success
                {
                    this.msg = "Se encogio Correctamente.";

                }
                else {
                    this.msg = "No Se encogio Correctamente."
                }
            },
            error => {
                this.msg = error;
            },
            () => {
                console.log(this.msg + " Sub car");

            }
        );
    }

    allowDragFunction(card: Card) {
        return this.allowedDragTo;
    }

    allowDropFunction(): any {
        return (dragData: Card) => {
            return this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    }

    cardDropped(ev: any) {
        let card: Card = ev.dragData;
        console.log("Entra");
        if (card.parent == this.allowDropParent[card.cardListId]) {
            card.cardListId = this.item.Id;
            card.parent = 'c';
            this._userService.put(Global.BASE_CARDS_ENDPOINT, card.Id, card).subscribe(
                data => {
                    if (data == 1) //Success
                    {
                        this.msg = "El departamento se ha actualizado exitosamente.";

                    }
                    else {
                        this.msg = "Hay problemas para guardar los datos!"
                    }
                },
                error => {
                    this.msg = error;
                },
                () => {

                    if (!this.existSub) {
                        this.loadCards();
                    }
                    else {
                        this.loadCardsSub();
                    }
                    console.log(this.msg + " Chaca Chaca");
                    this._userService.syncro.next(true);
                }
            );

        }
    }
    //Permite el cambiar de sublista en el mismo cardlist
    cardDropped2(ev: any, subcardlist: SubCardList) {
        let card: Card = ev.dragData;
        var cardAux = [{ Id: card.cardListId, parent: card.parent }];

        if (card.parent == this.allowDropParent[card.cardListId]) {
            card.cardListId = subcardlist.Id;
            card.parent = 's';
            console.log(card);
            this._userService.put(Global.BASE_CARDS_ENDPOINT, card.Id, card).subscribe(
                data => {
                    if (data == 1) //Success
                    {
                        this.msg = "El departamento se ha actualizado exitosamente.";

                    }
                    else {
                        this.msg = "Hay problemas para guardar los datos!"
                    }
                },
                error => {
                    this.msg = error;
                },
                () => {
                  
                    console.log(this.subcardlists.findIndex(x => x.Id == 2) + "Qui estoy")
                    if (this.subcardlists.findIndex(x => x.Id == cardAux[0].Id) < 0) {
                        this._userService.syncro.next(true);
                    }
                    //Creo que es inecesario y cada uno usara unos de los load Usando este el sub
                    if (!this.existSub) {
                        this.loadCards();
                    }
                    else {
                        this.loadCardsSub();
                    }
                    console.log(this.msg + " ::__:: El 2")
                }
            );
        }
    }

    showAddCard(id: number) {
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
        this.fatherIdCard = id;
        if (this.existSub)
            this.typeparent = 's';
        else
            this.typeparent = 'c';
    }

    saveAddCard() {
        //console.log('save card');
        this._userService.post(Global.BASE_CARDS_ENDPOINT, { name: this.cardname, description: this.carddescription, cardListId: this.fatherIdCard, parent: this.typeparent, isExpanded: true, orders: 0, created_at: "Hoy" })
            .subscribe(() => {
                if (!this.existSub) {
                    this.loadCards();
                }
                else {
                    this.loadCardsSub();
                }
            })
    }

    cancelAddCard() {
        this.toShowAddCard = false;
    }

    showAddSubCardList() {
        this.subcardlistname = '';
        this.toShowAddSubCardList = true;
    }

    saveAddSubCardList() {
        let created_at = 'Hoy';
        let newSubCardList: SubCardList = new SubCardList();
        newSubCardList.created_at = created_at;
        newSubCardList.isExpanded = true;
        this._userService.post(Global.BASE_SUBCARDLIST_ENDPOINT, { name: this.subcardlistname, cardlistId: this.item.Id, isExpanded: true, orders: this.subcardlists.length, created_at: 'hoy' }).subscribe(() => {
            this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
                .subscribe(
                s => {
                    //filter aqui.
                    this.subcardlists = s.filter((subcardlist: any) => subcardlist.cardlistId == this.item.Id);//resultado del filtrado
                    this.existSub = (this.subcardlists.length != 0);
                },
                error => this.msg = error,
                () => this.loadCardsSub());
        });
    }

    cancelAddSubCardList() {
        this.toShowAddSubCardList = false;
    }

}
