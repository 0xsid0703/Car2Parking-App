import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
    // tslint:disable-next-line:no-any
    protected data: Array<any>;
    public positions: Map<string, Array<number>>;
    public positionReservation: Map<string, Array<number>>;
    public lat: number;
    public lng: number;
    public noUniqueParking: string;

    public constructor(
            private _router: Router,
            private _dataService: DataService) {
        this.positionReservation = new Map<string, Array<number>>();
        this.getLocation();
        this.noUniqueParking = null;
        this.loadingPlaces();
    }

    public navigate(uri: string): void {
        this._router.navigateByUrl(uri);
    }

    public onMarkerClick(id: string, position: Array<number>): void {
        this.data.forEach((d) => {
            const lat: number = position[0];
            const lng: number = position[1];
            if (id === d.sNoPlace) {
                this.noUniqueParking = d.sNoPlace;
                this.positionReservation.clear();
                const arrayPosition: Array<number> = [lat, lng];
                this.positionReservation.set(this.noUniqueParking, arrayPosition);

                this.scrollToForm();
            }
        });
    }

    private scrollToForm(): void {
        document.querySelector('#reservation-container').scrollIntoView({
            behavior: 'smooth'
        });
    }

    private getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                this.lat = pos.coords.latitude;
                this.lng = pos.coords.longitude;
            });
        }
    }

    public async loadingPlaces(): Promise<void> {
        this.positions = new Map<string, Array<number>>();

        if (!this.data) {
            this.data = await this._dataService.getParkingData();
        }

        this.data.forEach((d) => {
            if (d.Occupation !== 1) {
                const arrayPosition: Array<number> = [d.nPositionCentreLatitude as number, d.nPositionCentreLongitude as number];
                this.positions.set(d.sNoPlace, arrayPosition);
            }
        });
    }
}
