import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Http, Jsonp} from '@angular/http'

import {XyzFilterByService} from '../shared/filter-by.service';
import {XyzUserListService} from './user-list.service';
//minimize the request: asynchronous programming with obervable
import{Subject} from 'rxjs/Subject';
//send the data when user typing is stopped
import 'rxjs/add/operator/debounceTime';
// discard duplicate user input
import 'rxjs/add/operator/distinctUntilChanged'



// url manipulation- query string, route parameter, fragments
// web storage
// file storage
// webSQL : SQLite -> indexedDB:complex to implement and index
// Cookies: expire date. default end of the session, available to cross domain
// server-side storage: need network access required

// *REST: representational State Transfer : standardized interface JSON,HTTP
// *AJAX: asynchronous js and xml
// window.localStorage.getItem()


@Component({
    selector: 'xyz-user-list',
    providers: [XyzFilterByService, XyzUserListService],
    templateUrl: 'app/user-list/user-list.component.html'
})





export class XyzUserListComponent implements OnInit {

    filter: string;
    users: User[];
    storageKey: string;
    path:string;
    revision:string;
    settingUrl:string;
    subject: Subject<string>;




    //inject router, activatedRoute
    constructor(private xyzUserListService: XyzUserListService,
                private xyzFilterByService: XyzFilterByService,
                private router: Router,
                private http:Http,
                private jsonp:Jsonp,
                private activatedRoute : ActivatedRoute) {
        this.storageKey = 'filter';
        this.activatedRoute.url.subscribe(url => this.path = url[0].path);
        this.settingUrl='http://localhost:5984/usr/settings';
        this.subject = new Subject();

    }




    // fire once on page load
    ngOnInit() {
        //2. make the filter item from JSON to string
        let storageValue = window.localStorage.getItem(this.storageKey);
        //4. check storage value is empty or not.
        this.filter = (storageValue) ? JSON.parse(storageValue) :'';
        // 5. get optional routes from the url: on url ;filter=abs
        // 6. instead of param, use fragment. (param: filter=abs, fragment:#abc)
        this.activatedRoute.fragment.subscribe(fragment => {
            this.filter = (fragment) ? fragment:'';
        });
        this.xyzUserListService.get()
            .then(users => {
                //3. check filter(input), before list Service
                if (this.filter && this.filter.length) {
                    this.users = this.xyzFilterByService.get({data: users, filter: this.filter});
                } else {
                    this.users = users;
                }
            });

        //7. couchdb database
        //1. http.get -> change to jsonp
        // couchDB not allow jsonp as default
        this.jsonp.get( `${this.settingUrl}?callback=JSONP_CALLBACK` )
            .subscribe(response =>{
                let settings = response.json();
                //internal property used by couchDB prevent conflict when update is requested
                this.revision = settings._rev;
                this.filter = (settings.filter && settings.filter.length) ? settings.filter : '';
            });


        // rxjs : debouceTime, network request only sent when typing is stopped
        this.subject.debounceTime(500).distinctUntilChanged()
            .subscribe(response => {
            this.onFilter(response);
        });

    }




    onFilter(filter) { //filter=keyword input
        this.filter = filter;
        let storageValue = JSON.stringify(filter);
        //1. setItem(key, value) to localSotrage
        window.localStorage.setItem(this.storageKey, storageValue);

        let filterParams={};
        filterParams[this.storageKey] = this.filter;

        //2. .navigate([array of path variable])
        //   use query strings(key:value), instead of routes
        //   use fragments, instead of query string
        this.router.navigate([this.path], {fragment: this.filter});


        //4. getting user data
        this.xyzUserListService.get()
            .then(users => {
                this.users = this.xyzFilterByService.get({
                    data: users,
                    filter: filter
                });
            });



        //2. update DB: http.put(dburl, requestBody, optionalSetting)
        this.http.put(this.settingUrl, {
            _rev:this.revision,
            filter:this.filter
        }).subscribe(response => {
            let settings = response.json();
           this.revision = settings.rev;
        });
    }


    onClear() {
        //1. remove optional routes from the url when clear button is clicked: queryParam-> {empty object}
        //2. replace queryParam with fragment:''
        this.router.navigate([this.path], {fragment:''});
        window.localStorage.removeItem(this.storageKey);
        this.xyzUserListService.get()
            .then(users => this.users = users);
        this.filter = '';


        //3. updateDB: same as onFilter(), .subscribe to update the db: filter -> empty string to clear
        this.http.put(this.settingUrl, {
            _rev:this.revision,
            filter:''
        }).subscribe(response => {
            let settings = response.json();
            this.revision = settings.rev;
        });
        // minizie requests with observaeble
    }
}
