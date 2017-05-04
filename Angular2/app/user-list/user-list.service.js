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
// getting data, add, delete from mock-user
var core_1 = require("@angular/core");
var mock_users_1 = require("../mock/mock-users");
var XyzUserListService = (function () {
    function XyzUserListService() {
    }
    XyzUserListService.prototype.get = function () {
        return Promise.resolve(mock_users_1.USERS);
    };
    XyzUserListService.prototype.add = function () { };
    XyzUserListService.prototype.delete = function () { };
    return XyzUserListService;
}());
XyzUserListService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], XyzUserListService);
exports.XyzUserListService = XyzUserListService;
//# sourceMappingURL=user-list.service.js.map