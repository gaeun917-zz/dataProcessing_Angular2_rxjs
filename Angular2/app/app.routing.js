"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var user_list_component_1 = require("./user-list/user-list.component");
//optional route parameters
var appRoutes = [
    { path: 'dashboard',
        component: user_list_component_1.XyzUserListComponent },
    { path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map