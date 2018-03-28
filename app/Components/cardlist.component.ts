import { Component, OnInit, Input } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { CardList } from "../models/cardlist-info";
import { SubCardList } from "../models/subcardlist-info";
import { Card } from "../models/card-info";
import { Task } from "../models/task-info";

import { Global } from '../Shared/global';
import { UserService } from "../Service/user.service"

@Component({
    selector: 'cardlist',
    templateUrl: 'app/Components/cardlist.component.html',
    styleUrls: ['app/Styles/cardlist.component.css']
})
export class CardListComponent implements OnInit {
    @Input() item: CardList;
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
    allowedDropFrom: any = [];
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
        dropping(){
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
                                console.log("Sub permitidos de"+this.item.name+": "+ sub.Id)
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

    clickCarret(subcardlist: any) {
        subcardlist.isExpanded = !subcardlist.isExpanded;
        this._userService.put(Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id, subcardlist);
    }

    allowDragFunction(card: Card) {
        return this.allowedDragTo;
    }

    allowDropFunction(): any {
        return (dragData: Card) => {
            return this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    }

    cardDropped(ev:any) {
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
                    
                    this.loadCards();
                    this.loadCardsSub();
                    console.log(this.msg)
                }
            );

        }
    }
    //Permite el cambiar de sublista en el mismo cardlist
    cardDropped2(ev:any, subcardlist: SubCardList) {
        let card: Card = ev.dragData;
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
                    this.loadCards();
                    this.loadCardsSub()
                console.log(this.msg)}
            );
            
        }
     
    }

    showAddCard(id: number, parentPar:string) {
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
        this.fatherIdCard = id;
        if (this.existSub)
            this.typeparent = 's';
        else
            this.typeparent = 'c';
    }

    cancelAddCard() {
        this.toShowAddCard = false;
    }

    showAddSubCardList() {
        this.subcardlistname = '';
        this.toShowAddSubCardList = true;
    }

    cancelAddSubCardList() {
        this.toShowAddSubCardList = false;
    }
}
