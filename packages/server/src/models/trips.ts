export interface City {
    cityName: string;
    numDays: Number;
    modeOfTransport: string;
}

export interface Trip {
    tripId: string;
    tripName: string;
    cities?: City[];
    startDate: Date;
    departureAirport: string;
}