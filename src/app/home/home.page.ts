import { AudioguideService } from './../services/audioguide.service';
import { LocationsService } from './../services/locations.service';
import { Component, OnInit } from '@angular/core';
import { Country, Location } from '../services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    locations: Location[] = [];
    locationsResolver: Location[] = [];
    locationsSearched: Location[] = [];
    country: Country;
    numberOfAudioguides = 0;
    storageImageRef: any;
    loader: any;
    countryList: Country[] = [];

    lang: string;

    isSearched = true;
    lastKeyPress = 0;

    constructor(private locationService: LocationsService,
        private audioguideService: AudioguideService,
        private activatedRoute: ActivatedRoute,
        public translate: TranslateService,
        private router: Router) {
            this.lang = this.translate.getDefaultLang();
    }

    ngOnInit() {
        this.getLocations();
        this.locationsResolver = this.activatedRoute.snapshot.data.locationList;
        console.log('resolver', this.locationsResolver);
        this.locations.forEach(country => {
            console.log(country)
            country.language.find(language => language.code === this.lang);
        });
    }

    getLocations($event?) {
        // this.presentLoadingWithOptions('Loading locations...');
        const idLocation = $event;
        this.locationsResolver = this.activatedRoute.snapshot.data.locationList;
        // this.locationService.getLocations().subscribe(locations => {
        //     this.locations = [];
        this.locationsResolver.forEach(element => {
            // Getting the audioguides by location
            this.audioguideService.getAudioguideListByLocation(element.key).subscribe(audioguides => {
                audioguides = audioguides.filter(audioguide => audioguide.reviewed === true);
                if (idLocation !== undefined) {
                    audioguides = audioguides.filter(audioguide => audioguide.idLocation === idLocation);
                }
                element.numberOfAudioguides = audioguides.length;
                if (element.numberOfAudioguides > 0) {
                    // Getting the country by location
                    this.locationService.getCountryById(element.idCountry).subscribe(country => {
                        const countryName = country[0].language.find(language => language.code === this.lang);
                        element.countryName = countryName.name;
                    });
                    // Getting the location by selected lang
                    const locationNameLang = element.language.find(language => language.code === this.lang);
                    element.locationName = locationNameLang.name;
                    this.locations.push(element);
                }
            });
        });
        this.locationsSearched = this.locations;
        // }, error => console.log(error)
        // );
    }

    initializeList(): void {
        this.locations = this.locationsSearched;
    }

    searchLocations($event: any) {

        this.initializeList();

        const val = $event.target.value;
        if (val && val.trim() !== '') {
            this.locations = this.locations.filter(location => {
                return location.language.filter(language => language.name.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0;
            });
        }
    }

    openLocation(location: Location) {
        this.router.navigate(['/tabs/home/list-guides/' + location.key]);
    }

}
