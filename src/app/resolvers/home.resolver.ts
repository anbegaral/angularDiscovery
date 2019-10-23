import { map, take } from 'rxjs/operators';
import { LocationsService } from './../services/locations.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Country } from '../services/models';

@Injectable()
export class HomeResolver implements Resolve<any> {

    constructor(private locationService: LocationsService) { }

    resolve() {
        console.log('entra en resolver');
        return this.locationService.getLocations().pipe(take(1));
    }
}
