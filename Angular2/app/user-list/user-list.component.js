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
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var filter_by_service_1 = require("../shared/filter-by.service");
var user_list_service_1 = require("./user-list.service");
//minimize the request: asynchronous programming with obervable
var Subject_1 = require("rxjs/Subject");
//send the data when user typing is stopped
require("rxjs/add/operator/debounceTime");
// discard duplicate user input
require("rxjs/add/operator/distinctUntilChanged");
// url manipulation- query string, route parameter, fragments
// web storage
// file storage
// webSQL : SQLite -> indexedDB:complex to implement and index
// Cookies: expire date. default end of the session, available to cross domain
// server-side storage: need network access required
// *REST: representational State Transfer : standardized interface JSON,HTTP
// *AJAX: asynchronous js and xml
// window.localStorage.getItem()
var XyzUserListComponent = (function () {
    //inject router, activatedRoute
    function XyzUserListComponent(xyzUserListService, xyzFilterByService, router, http, jsonp, activatedRoute) {
        var _this = this;
        this.xyzUserListService = xyzUserListService;
        this.xyzFilterByService = xyzFilterByService;
        this.router = router;
        this.http = http;
        this.jsonp = jsonp;
        this.activatedRoute = activatedRoute;
        this.storageKey = 'filter';
        this.activatedRoute.url.subscribe(function (url) { return _this.path = url[0].path; });
        this.settingUrl = 'http://localhost:5984/usr/settings';
        this.subject = new Subject_1.Subject();
    }
    // fire once on page load
    XyzUserListComponent.prototype.ngOnInit = function () {
        var _this = this;
        //2. make the filter item from JSON to string
        var storageValue = window.localStorage.getItem(this.storageKey);
        //4. check storage value is empty or not.
        this.filter = (storageValue) ? JSON.parse(storageValue) : '';
        // 5. get optional routes from the url: on url ;filter=abs
        // 6. instead of param, use fragment. (param: filter=abs, fragment:#abc)
        this.activatedRoute.fragment.subscribe(function (fragment) {
            _this.filter = (fragment) ? fragment : '';
        });
        this.xyzUserListService.get()
            .then(function (users) {
            //3. check filter(input), before list Service
            if (_this.filter && _this.filter.length) {
                _this.users = _this.xyzFilterByService.get({ data: users, filter: _this.filter });
            }
            else {
                _this.users = users;
            }
        });
        //7. couchdb database
        //1. http.get -> change to jsonp
        // couchDB not allow jsonp as default
        this.jsonp.get(this.settingUrl + "?callback=JSONP_CALLBACK")
            .subscribe(function (response) {
            var settings = response.json();
            //internal property used by couchDB prevent conflict when update is requested
            _this.revision = settings._rev;
            _this.filter = (settings.filter && settings.filter.length) ? settings.filter : '';
        });
        // rxjs : debouceTime, network request only sent when typing is stopped
        this.subject.debounceTime(500).distinctUntilChanged()
            .subscribe(function (response) {
            _this.onFilter(response);
        });
    };
    XyzUserListComponent.prototype.onFilter = function (filter) {
        var _this = this;
        this.filter = filter;
        var storageValue = JSON.stringify(filter);
        //1. setItem(key, value) to localSotrage
        window.localStorage.setItem(this.storageKey, storageValue);
        var filterParams = {};
        filterParams[this.storageKey] = this.filter;
        //2. .navigate([array of path variable])
        //   use query strings(key:value), instead of routes
        //   use fragments, instead of query string
        this.router.navigate([this.path], { fragment: this.filter });
        //4. getting user data
        this.xyzUserListService.get()
            .then(function (users) {
            _this.users = _this.xyzFilterByService.get({
                data: users,
                filter: filter
            });
        });
        //2. update DB: http.put(dburl, requestBody, optionalSetting)
        this.http.put(this.settingUrl, {
            _rev: this.revision,
            filter: this.filter
        }).subscribe(function (response) {
            var settings = response.json();
            _this.revision = settings.rev;
        });
    };
    XyzUserListComponent.prototype.onClear = function () {
        var _this = this;
        //1. remove optional routes from the url when clear button is clicked: queryParam-> {empty object}
        //2. replace queryParam with fragment:''
        this.router.navigate([this.path], { fragment: '' });
        window.localStorage.removeItem(this.storageKey);
        this.xyzUserListService.get()
            .then(function (users) { return _this.users = users; });
        this.filter = '';
        //3. updateDB: same as onFilter(), .subscribe to update the db: filter -> empty string to clear
        this.http.put(this.settingUrl, {
            _rev: this.revision,
            filter: ''
        }).subscribe(function (response) {
            var settings = response.json();
            _this.revision = settings.rev;
        });
        // minizie requests with observaeble
    };
    return XyzUserListComponent;
}());
XyzUserListComponent = __decorate([
    core_1.Component({
        selector: 'xyz-user-list',
        providers: [filter_by_service_1.XyzFilterByService, user_list_service_1.XyzUserListService],
        templateUrl: 'app/user-list/user-list.component.html'
    }),
    __metadata("design:paramtypes", [user_list_service_1.XyzUserListService,
        filter_by_service_1.XyzFilterByService,
        router_1.Router,
        http_1.Http,
        http_1.Jsonp,
        router_1.ActivatedRoute])
], XyzUserListComponent);
exports.XyzUserListComponent = XyzUserListComponent;
//# sourceMappingURL=user-list.component.js.map