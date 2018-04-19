"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var app_routing_1 = require("./app.routing");
var department_component_1 = require("./components/department.component");
var cardlist_component_1 = require("./Components/cardlist.component");
var card_component_1 = require("./Components/card.component");
var user_service_1 = require("./Service/user.service");
var ng2_dnd_1 = require("ng2-dnd");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var ngx_bootstrap_2 = require("ngx-bootstrap");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.ReactiveFormsModule, http_1.HttpModule, app_routing_1.routing, ng2_bs3_modal_1.Ng2Bs3ModalModule, forms_1.FormsModule, ngx_bootstrap_1.AlertModule.forRoot(), ngx_bootstrap_2.ModalModule.forRoot(), ng2_dnd_1.DndModule.forRoot()],
            declarations: [app_component_1.AppComponent, department_component_1.DepartmentComponent, cardlist_component_1.CardListComponent, card_component_1.CardComponent],
            providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }, user_service_1.UserService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map