"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var cardlist_info_1 = require("../models/cardlist-info");
var subcardlist_info_1 = require("../models/subcardlist-info");
var global_1 = require("../Shared/global");
var user_service_1 = require("../Service/user.service");
var CardListComponent = (function () {
    function CardListComponent(_userService) {
        this._userService = _userService;
        this.dropUpdate = new core_1.EventEmitter();
        this.cardlistEmpty = true;
        this.allowedDropFrom = [];
        this.allowedDragTo = false;
        this.allowDropParent = [];
    }
    CardListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_SUBCARDLIST_ENDPOINT)
            .subscribe(function (s) {
            //filter aqui.
            _this.subcardlists = s.filter(function (subcardlist) { return subcardlist.cardlistId == _this.item.Id; }); //resultado del filtrado
            _this.existSub = (_this.subcardlists.length != 0);
            console.log(_this.existSub);
        }, function (error) { return _this.msg = error; }, function () {
            if (!_this.existSub) {
                _this.loadCards();
            }
            else {
                _this.loadCardsSub();
            }
            _this.dropping();
        });
    };
    CardListComponent.prototype.dropping = function () {
        //fill allowed drop-from containers
        var _this = this;
        //Usar item para el id del proyecto, con el que sacar 
        //los card list y filtrar o lo que sea por orden.
        //luego comprobar si el siguiente tiene subcardlist
        this.allowedDropFrom = [];
        var carp;
        this._userService.get(global_1.Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(function (p) {
            carp = p.filter(function (cardlist) { return cardlist.projectId == (_this.item.projectId); });
            //Esto en complete()
        }, function (error) { return _this.msg = error; }, function () {
            _this.allowedDropFrom = [];
            carp.forEach(function (p1) {
                if (p1.orders == _this.item.orders - 1) {
                    _this.allowedDropFrom.push(p1.Id);
                    _this.allowDropParent[p1.Id] = 'c';
                }
                console.log("cardlist normales: " + p1.Id);
                //Hasta aqui permite el pase de cardlist normales
            });
            //Add subcardlists keys to allowedDropFrom variable.
            //this one add sublist in case the next cardlist has subcardlists
            _this._userService.get(global_1.Global.BASE_SUBCARDLIST_ENDPOINT)
                .subscribe(function (data) {
                //aqui deberia hacer un foreach? MODIFICANDO
                var sublist = data.filter(function (subcardlist) { return subcardlist.cardlistId == (_this.allowedDropFrom[0]); });
                if (sublist.length > 0 && _this.item.orders != 0)
                    sublist.forEach(function (sub) {
                        _this.allowedDropFrom.push(sub.Id);
                        _this.allowDropParent[sub.Id] = 's';
                        console.log("Sub permitidos de" + _this.item.name + ": " + sub.Id);
                    });
            }, function (error) { return _this.msg = error; }, function () {
                //Let change card between subcardlist in the same card list
                if (_this.subcardlists && _this.subcardlists.length > 0) {
                    _this.subcardlists.forEach(function (sub) {
                        _this.allowedDropFrom.push(sub.Id);
                        _this.allowDropParent[sub.Id] = 's';
                    });
                }
            });
        });
        //fill if it has next containers
        //filtrar por order.
        //filtra tambien el projecto, para depejar los cardlist que 
        //no sean del proyecto pero tengan el mismo orden
        this._userService.get(global_1.Global.BASE_CARDLIST_ENDPOINT) //
            .subscribe(function (d) {
            _this.item.orders + 1;
            var ordA = d.filter(function (cardlist) { return cardlist.orders == (_this.item.orders + 1); });
            ordA = ordA.filter(function (cardlist) { return cardlist.projectId == (_this.item.projectId); });
            if (ordA.length > 0 || _this.existSub)
                _this.allowedDragTo = true;
        });
    };
    CardListComponent.prototype.loadCards = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_CARDS_ENDPOINT)
            .subscribe(function (cards) {
            _this.cards = cards.filter(function (cards) { return cards.cardListId == _this.item.Id; });
            _this.cards = _this.cards.filter(function (cards) { return cards.parent == 'c'; });
            console.log("cartas 1: " + Object.keys(_this.cards));
        });
    };
    CardListComponent.prototype.loadCardsSub = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_CARDS_ENDPOINT)
            .subscribe(function (cards) {
            console.log("Cartas 3: " + cards);
            //en cards ya tenemos todas las cartas, solo hace falta
            //usar el bucle para cambiar el filtrado y guardar las 
            //cartas, como aun esta por decidirse.
            _this.cardsSub = [];
            _this.subcardlists.forEach(function (sub) {
                //Tal vez intentar poner al conjunto de cards una key
                //como referenc�a al subcardlists.
                _this.cardsSub[sub.name] = (cards.filter(function (cards) { return cards.cardListId == sub.Id; }));
                _this.cardsSub[sub.name] = _this.cardsSub[sub.name].filter(function (cards) { return cards.parent == 's'; });
            });
            console.log("cartas 2: " + Object.keys(_this.cardsSub));
        });
    };
    CardListComponent.prototype.deleteCard = function (card) {
        var _this = this;
        var tasks;
        this._userService.get(global_1.Global.BASE_TASKS_ENDPOINT)
            .subscribe(function (c) {
            tasks = c.filter(function (task) { return task.cardId == card.Id; });
            if (tasks.length < 1) {
                _this._userService.delete(global_1.Global.BASE_CARDS_ENDPOINT, card.Id).subscribe(function () {
                    if (!_this.existSub) {
                        _this.loadCards();
                    }
                    else {
                        _this.loadCardsSub();
                    }
                });
            }
            else {
                tasks.forEach(function (tk) {
                    return _this._userService.delete(global_1.Global.BASE_TASKS_ENDPOINT, tk.Id).subscribe(function () {
                        console.log(tasks + ", Antes, vacio?" + (tasks.length < 1));
                        tasks.splice(tasks.findIndex(function (x) { return x.Id == tk.Id; }), 1);
                        console.log(tasks + ", Despues vacio?" + (tasks.length < 1));
                        if (tasks.length < 1) {
                            _this._userService.delete(global_1.Global.BASE_CARDS_ENDPOINT, card.Id).subscribe(function () {
                                if (!_this.existSub) {
                                    _this.loadCards();
                                }
                                else {
                                    _this.loadCardsSub();
                                }
                            });
                        }
                    });
                });
            }
        });
    };
    CardListComponent.prototype.deleteSublist = function (subcardlist) {
        var _this = this;
        var sublistBigger;
        var vacio;
        vacio = this.cardsSub.filter(function (card) { return card.cardListId == subcardlist.Id; }).length < 1;
        if (vacio) {
            this._userService.delete(global_1.Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id)
                .subscribe(function (data) {
                sublistBigger = _this.subcardlists.filter(function (subcardl) { return subcardl.orders > subcardlist.orders; });
                console.log(sublistBigger);
                sublistBigger.forEach(function (sub) {
                    sub.orders = sub.orders - 1;
                    _this._userService.put(global_1.Global.BASE_SUBCARDLIST_ENDPOINT, sub.Id, sub)
                        .subscribe();
                });
            }, function (error) { _this.msg = error; console.log(_this.msg); }, function () {
                _this._userService.get(global_1.Global.BASE_SUBCARDLIST_ENDPOINT)
                    .subscribe(function (s) {
                    return _this.subcardlists = s.filter(function (subcardlist) { return subcardlist.cardlistId == _this.item.Id; });
                }, function (error) { return _this.msg = error; }, function () {
                    _this.loadCardsSub();
                });
            });
        }
    };
    CardListComponent.prototype.clickCarret = function (subcardlist) {
        var _this = this;
        subcardlist.isExpanded = !subcardlist.isExpanded;
        this._userService.put(global_1.Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id, subcardlist).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Se encogio Correctamente.";
            }
            else {
                _this.msg = "No Se encogio Correctamente.";
            }
        }, function (error) {
            _this.msg = error;
        }, function () {
            console.log(_this.msg + " Sub car");
        });
    };
    CardListComponent.prototype.allowDragFunction = function (card) {
        return this.allowedDragTo;
    };
    CardListComponent.prototype.allowDropFunction = function () {
        var _this = this;
        return function (dragData) {
            return _this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    };
    CardListComponent.prototype.cardDropped = function (ev) {
        var _this = this;
        var card = ev.dragData;
        console.log("Entra");
        if (card.parent == this.allowDropParent[card.cardListId]) {
            card.cardListId = this.item.Id;
            card.parent = 'c';
            this._userService.put(global_1.Global.BASE_CARDS_ENDPOINT, card.Id, card).subscribe(function (data) {
                if (data == 1) {
                    _this.msg = "El departamento se ha actualizado exitosamente.";
                }
                else {
                    _this.msg = "Hay problemas para guardar los datos!";
                }
            }, function (error) {
                _this.msg = error;
            }, function () {
                if (!_this.existSub) {
                    _this.loadCards();
                }
                else {
                    _this.loadCardsSub();
                }
                console.log(_this.msg + " Chaca Chaca");
                _this._userService.syncro.next(true);
            });
        }
    };
    //Permite el cambiar de sublista en el mismo cardlist
    CardListComponent.prototype.cardDropped2 = function (ev, subcardlist) {
        var _this = this;
        var card = ev.dragData;
        var cardAux = [{ Id: card.cardListId, parent: card.parent }];
        if (card.parent == this.allowDropParent[card.cardListId]) {
            card.cardListId = subcardlist.Id;
            card.parent = 's';
            console.log(card);
            this._userService.put(global_1.Global.BASE_CARDS_ENDPOINT, card.Id, card).subscribe(function (data) {
                if (data == 1) {
                    _this.msg = "El departamento se ha actualizado exitosamente.";
                }
                else {
                    _this.msg = "Hay problemas para guardar los datos!";
                }
            }, function (error) {
                _this.msg = error;
            }, function () {
                console.log(_this.subcardlists.findIndex(function (x) { return x.Id == 2; }) + "Qui estoy");
                if (_this.subcardlists.findIndex(function (x) { return x.Id == cardAux[0].Id; }) < 0) {
                    _this._userService.syncro.next(true);
                }
                //Creo que es inecesario y cada uno usara unos de los load Usando este el sub
                if (!_this.existSub) {
                    _this.loadCards();
                }
                else {
                    _this.loadCardsSub();
                }
                console.log(_this.msg + " ::__:: El 2");
            });
        }
    };
    CardListComponent.prototype.showAddCard = function (id) {
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
        this.fatherIdCard = id;
        if (this.existSub)
            this.typeparent = 's';
        else
            this.typeparent = 'c';
    };
    CardListComponent.prototype.saveAddCard = function () {
        var _this = this;
        //console.log('save card');
        this._userService.post(global_1.Global.BASE_CARDS_ENDPOINT, { name: this.cardname, description: this.carddescription, cardListId: this.fatherIdCard, parent: this.typeparent, isExpanded: true, orders: 0, created_at: "Hoy" })
            .subscribe(function () {
            if (!_this.existSub) {
                _this.loadCards();
            }
            else {
                _this.loadCardsSub();
            }
        });
    };
    CardListComponent.prototype.cancelAddCard = function () {
        this.toShowAddCard = false;
    };
    CardListComponent.prototype.showAddSubCardList = function () {
        this.subcardlistname = '';
        this.toShowAddSubCardList = true;
    };
    CardListComponent.prototype.saveAddSubCardList = function () {
        var _this = this;
        var created_at = 'Hoy';
        var newSubCardList = new subcardlist_info_1.SubCardList();
        newSubCardList.created_at = created_at;
        newSubCardList.isExpanded = true;
        this._userService.post(global_1.Global.BASE_SUBCARDLIST_ENDPOINT, { name: this.subcardlistname, cardlistId: this.item.Id, isExpanded: true, orders: this.subcardlists.length, created_at: 'hoy' }).subscribe(function () {
            _this._userService.get(global_1.Global.BASE_SUBCARDLIST_ENDPOINT)
                .subscribe(function (s) {
                //filter aqui.
                _this.subcardlists = s.filter(function (subcardlist) { return subcardlist.cardlistId == _this.item.Id; }); //resultado del filtrado
                _this.existSub = (_this.subcardlists.length != 0);
            }, function (error) { return _this.msg = error; }, function () { return _this.loadCardsSub(); });
        });
    };
    CardListComponent.prototype.cancelAddSubCardList = function () {
        this.toShowAddSubCardList = false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", cardlist_info_1.CardList)
    ], CardListComponent.prototype, "item", void 0);
    CardListComponent = __decorate([
        core_1.Component({
            selector: 'cardlist',
            templateUrl: 'app/Components/cardlist.component.html',
            styleUrls: ['app/Styles/cardlist.component.css'],
        }),
        __metadata("design:paramtypes", [user_service_1.UserService])
    ], CardListComponent);
    return CardListComponent;
}());
exports.CardListComponent = CardListComponent;
//# sourceMappingURL=cardlist.component.js.map