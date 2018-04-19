"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var department_component_1 = require("./components/department.component");
var appRoutes = [
    { path: '', redirectTo: 'kanban', pathMatch: 'full' },
    { path: 'kanban', component: department_component_1.DepartmentComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map