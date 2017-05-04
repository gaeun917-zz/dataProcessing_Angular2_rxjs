"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var XyzFilterByService = (function () {
    function XyzFilterByService() {
    }
    XyzFilterByService.prototype.get = function (_a) {
        var data = _a.data, filter = _a.filter;
        return data.filter(function (user) {
            if (user.name && isMatch(user.name, filter))
                return user;
        });
    };
    return XyzFilterByService;
}());
XyzFilterByService = __decorate([
    core_1.Injectable()
], XyzFilterByService);
exports.XyzFilterByService = XyzFilterByService;
function isMatch(name, filter) {
    return name.match(new RegExp(filter, 'i'));
}
//# sourceMappingURL=filter-by.service.js.map