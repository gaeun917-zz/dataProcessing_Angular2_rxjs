import { Injectable } from '@angular/core';



@Injectable()





export class XyzFilterByService {

  get({ data, filter }: Params): User[] {
    return data.filter(user => {
      if (user.name && isMatch(user.name, filter)) return user;
    })
  }
}

function isMatch(name: string, filter: string): RegExpMatchArray {
  return name.match(new RegExp(filter, 'i'));
}