export interface City {
    cityName: string;
    numDays: Number;
}

export interface Trip {
    tripId: string;
    tripName: string;
    cities?: City[];
    startDate: Date;
}