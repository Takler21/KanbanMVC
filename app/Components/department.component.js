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
var platform_browser_1 = require("@angular/platform-browser");
var user_service_1 = require("../Service/user.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var global_1 = require("../Shared/global");
var DepartmentComponent = (function () {
    function DepartmentComponent(fb, _userService, sanitizer) {
        this.fb = fb;
        this._userService = _userService;
        this.sanitizer = sanitizer;
        this.indLoading = false;
        this.css_color_names = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
    }
    DepartmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_PROJECT_ENDPOINT)
            .subscribe(function (projects) { console.log(projects); _this.projects = projects; _this.indLoading = false; }, function (error) { return _this.msg = error; }, function () {
            _this.project = _this.projects[0];
            _this.LoadCardLists();
            _this._userService.syncro.subscribe(function (syn) {
                _this.syncro = syn;
                console.log(_this.syncro + " Es el syn");
                if (_this.syncro) {
                    _this._userService.syncro.next(false);
                    _this.LoadCardLists();
                }
            });
        });
    };
    DepartmentComponent.prototype.LoadProjects = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_PROJECT_ENDPOINT)
            .subscribe(function (projects) { console.log(projects); _this.projects = projects; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    DepartmentComponent.prototype.LoadCardLists = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(function (cardlist) {
            _this.cardLists = cardlist;
            _this.cardLists = _this.cardLists.filter(function (cardlist) { return cardlist.projectId == _this.project.Id; });
            //console.log("Sin orden: "+this.cardLists)
            _this.cardLists.sort(function (orderA, orderB) { return orderA.orders - orderB.orders; });
            //console.log("Tras orden: "+this.cardLists)
            //tal vez meter aqui el LoadIds()
        }, function (error) { return _this.msg = error; }, function () {
            console.log(_this.cardLists);
        } //Deberiamos poner algo aqui?
        );
    };
    DepartmentComponent.prototype.changeOrders = function (mod, rders) {
        var _this = this;
        var cardL = this.cardLists.filter(function (cardlist) { return cardlist.orders >= rders; });
        console.log(cardL);
        console.log("Longitud: " + cardL.length);
        if (cardL.length > 1) {
            cardL.forEach(function (l) {
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
                if ((mod && l.orders == _this.cardLists.length) || (!mod && l.orders == _this.cardLists.length - 2))
                    _this._userService.put(global_1.Global.BASE_CARDLIST_ENDPOINT, l.Id, l).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Se modifico el Orden Del Ultimo";
                            console.log(_this.msg);
                            console.log(cardL);
                        }
                        else {
                            _this.msg = "problemas para Cambiar el Orden!";
                        }
                    }, function (error) {
                        _this.msg = error;
                    }, function () { _this.LoadCardLists(); });
                else
                    _this._userService.put(global_1.Global.BASE_CARDLIST_ENDPOINT, l.Id, l).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Se modifico correctamente el orden de un elemento";
                            console.log(_this.msg);
                            console.log(cardL);
                        }
                        else {
                            _this.msg = "No se modifico correctamente le orden de un elemento";
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
            });
        }
        else
            this.LoadCardLists();
    };
    DepartmentComponent.prototype.editDepart = function (id) {
    };
    DepartmentComponent.prototype.deleteProject = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_PROJECT_ENDPOINT).subscribe(function (dat) {
            _this.cardLists.forEach(function (calist) {
                _this.deleteCardlist(calist);
            });
        }, function (error) { return _this.msg = error; }, function () {
            _this._userService.delete(global_1.Global.BASE_PROJECT_ENDPOINT, _this.project.Id).subscribe(function () {
                var indice;
                indice = _this.projects.findIndex(function (x) { return x.Id == _this.project.Id; });
                _this.projects.splice(indice, 1);
                if (indice == _this.projects.length)
                    indice = indice - 1;
                console.log("Entro al delete project la parte final.    " + indice);
                _this.project = _this.projects[indice];
                //.splice(tasks.findIndex(x => x.Id == tk.Id), 1)
            });
        });
    };
    DepartmentComponent.prototype.styles = function () {
        var sty = "width:" + 100 / this.cardLists.length + "%; float: left";
        return this.sanitizer.bypassSecurityTrustStyle(sty);
    };
    DepartmentComponent.prototype.showAddProject = function () {
        this.projectname = '';
        this.toShowAddProject = true;
    };
    DepartmentComponent.prototype.saveAddProject = function () {
        var _this = this;
        var created_at = new Date().toString();
        this._userService.post(global_1.Global.BASE_PROJECT_ENDPOINT, { name: this.projectname, created_at: created_at })
            .subscribe(function () { _this.LoadProjects(); _this.cancelAddProject(); });
    };
    //Ocultar modal project
    DepartmentComponent.prototype.cancelAddProject = function () {
        this.toShowAddProject = false;
    };
    //Mostrar modal cardlist
    DepartmentComponent.prototype.showAddCardList = function () {
        this.cardlistname = '';
        this.cardlistcolor = '';
        this.cardlistorder = this.cardLists.length;
        this.toShowAddCardList = true;
    };
    DepartmentComponent.prototype.saveAddCardList = function () {
        var _this = this;
        this._userService.post(global_1.Global.BASE_CARDLIST_ENDPOINT, { name: this.cardlistname, color: this.cardlistcolor, orders: this.cardlistorder, created_at: 'Hoy', projectId: this.project.Id })
            .subscribe(function () { return _this.changeOrders(true, _this.cardlistorder); });
    };
    //Ocultar modal cardlist
    DepartmentComponent.prototype.cancelAddCardList = function () {
        this.toShowAddCardList = false;
    };
    DepartmentComponent.prototype.deleteCardlist = function (cardList) {
        var _this = this;
        console.log("cardlist: " + cardList);
        console.log("cardlist: " + cardList.Id);
        var subVerification;
        var noVacio = false;
        this._userService.get(global_1.Global.BASE_SUBCARDLIST_ENDPOINT)
            .subscribe(function (sub) {
            subVerification = sub.filter(function (subcardL) { return subcardL.cardlistId == cardList.Id; });
            console.log("subcardlist: " + subVerification);
            if (subVerification.length > 0) {
                subVerification.forEach(function (s) {
                    _this._userService.get(global_1.Global.BASE_CARDS_ENDPOINT).subscribe(function (data) {
                        console.log("primer lote cartas: " + data.filter(function (card) { return card.cardListId == s.Id && card.parent == 's'; }));
                        if (data.filter(function (card) { return card.cardListId == s.Id && card.parent == 's'; }).length > 0)
                            noVacio = true;
                    });
                });
            }
            else {
                _this._userService.get(global_1.Global.BASE_CARDS_ENDPOINT).subscribe(function (data) {
                    console.log("segundo lote cartas: " + data.filter(function (card) { return card.cardListId == cardList.Id && card.parent == 'c'; }));
                    if (data.filter(function (card) { return card.cardListId == cardList.Id && card.parent == 'c'; }).length > 0)
                        noVacio = true;
                });
            }
        }, function (error) { _this.msg = error; console.log(_this.msg); }, function () {
            console.log("Entra");
            if (noVacio)
                alert("Por Favor vacie la lista de cartas");
            else {
                console.log("Entra");
                if (subVerification.length > 0) {
                    subVerification.forEach(function (s, index) {
                        _this._userService.delete(global_1.Global.BASE_SUBCARDLIST_ENDPOINT, s.Id).subscribe(function () {
                            if (index == subVerification.length - 1)
                                _this._userService.delete(global_1.Global.BASE_CARDLIST_ENDPOINT, cardList.Id)
                                    .subscribe(function () {
                                    console.log("Se borraron los datos tras borrar los subcardlist");
                                    _this.changeOrders(false, cardList.orders);
                                });
                        });
                    });
                }
                else {
                    _this._userService.delete(global_1.Global.BASE_CARDLIST_ENDPOINT, cardList.Id)
                        .subscribe(function () {
                        console.log("Se borraron los datos del cardlist sin subcardlists");
                        _this.changeOrders(false, cardList.orders);
                    });
                }
            }
        });
    };
    DepartmentComponent.prototype.onChange = function (val) {
        console.log(val);
        this.project = val;
        //this.exportService.projectExp = val;
        this.LoadCardLists();
        // this.exportService.setJsonExport();
    };
    DepartmentComponent.prototype.updateOnDrop = function (ev) {
        console.log("Detecto el movimient de particulas");
        //
        console.log("Detecto el movimient de particulas");
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], DepartmentComponent.prototype, "modal", void 0);
    DepartmentComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/department.component.html',
            styleUrls: ['app/Styles/project.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, platform_browser_1.DomSanitizer])
    ], DepartmentComponent);
    return DepartmentComponent;
}());
exports.DepartmentComponent = DepartmentComponent;
//# sourceMappingURL=department.component.js.map