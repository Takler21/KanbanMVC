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
var card_info_1 = require("../models/card-info");
var task_info_1 = require("../models/task-info");
var global_1 = require("../Shared/global");
var user_service_1 = require("../Service/user.service");
var CardComponent = (function () {
    function CardComponent(_userService) {
        this._userService = _userService;
        //console.log(this.item);
    }
    CardComponent.prototype.ngOnInit = function () {
        //console.log(this.item);
        this.loadTasks();
    };
    CardComponent.prototype.loadTasks = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_TASKS_ENDPOINT)
            .subscribe(function (c) {
            _this.tasks = c.filter(function (tasks) { return tasks.cardId == _this.item.Id; });
        });
    };
    CardComponent.prototype.addNewTask = function () {
        var _this = this;
        //console.log('Add new subtask!');
        var newTask = new task_info_1.Task();
        newTask.created_at = new Date().toString().trim();
        console.log(newTask.created_at);
        this._userService.post(global_1.Global.BASE_TASKS_ENDPOINT, { cardId: this.item.Id, description: this.newtaskdesc, isCompleted: false, orders: 0, created_at: "Hoy" }).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "El departamento se ha actualizado exitosamente.";
                console.log(_this.msg);
            }
            else {
                _this.msg = "Hay problemas para guardar los datos!";
                console.log(_this.msg);
            }
        }, function (error) {
            _this.msg = error;
        }, function () { _this.loadTasks(); _this.newtaskdesc = ""; });
        //this.exportService.getJsonExport();
    };
    //elimina la tarea de la carta
    CardComponent.prototype.deleteTask = function (task) {
        var _this = this;
        //console.log(task);
        console.log(typeof (task.Id) + "   -   " + task.Id);
        this._userService.delete(global_1.Global.BASE_TASKS_ENDPOINT, task.Id).subscribe(function () { _this.loadTasks(); });
        //this.childModal.show();
    };
    //Cambia el estado de la tarea si esta incompleta a completa y viceversa
    CardComponent.prototype.changeTaskCompleted = function (task) {
        var _this = this;
        console.log(task);
        var taskAux = task;
        //taskAux.isCompleted = !taskAux.isCompleted;
        this._userService.put(global_1.Global.BASE_TASKS_ENDPOINT, task.Id, task).subscribe(function (data) {
            if (data == 1) {
                _this.msg = "Se completo Correctamente.";
            }
            else {
                _this.msg = "No Se completo Correctamente.";
            }
        }, function (error) {
            _this.msg = error;
        }, function () {
            console.log(_this.msg + " Sub car");
        });
    };
    ////////////////////////////
    //Aqui primera intervencion.
    ////////////////////////////
    CardComponent.prototype.clickCarret = function () {
        this.item.isExpanded = !this.item.isExpanded;
        this._userService.put(global_1.Global.BASE_CARDS_ENDPOINT, this.item.Id, this.item).subscribe();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", card_info_1.Card)
    ], CardComponent.prototype, "item", void 0);
    CardComponent = __decorate([
        core_1.Component({
            selector: 'card',
            templateUrl: 'app/Components/card.component.html',
            styleUrls: ['app/Styles/card.component.css']
        }),
        __metadata("design:paramtypes", [user_service_1.UserService])
    ], CardComponent);
    return CardComponent;
}());
exports.CardComponent = CardComponent;
//# sourceMappingURL=card.component.js.map