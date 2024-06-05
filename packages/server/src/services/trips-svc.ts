import { Schema, Model, Document, model } from "mongoose";
import { Trip, City } from "../models/trips";

const CitySchema = new Schema<City>({
    cityName: { type: String, required: true, trim: true },
    numDays: { type: Number, required: true },
});

const TripSchema = new Schema<Trip>({
    tripId: { type: String, required: true, trim: true },
    tripName: { type: String, required: true, trim: true },
    cities: [CitySchema],
    startDate: { type: Date, required: true },
});

const TripModel = model<Trip>("Trip", TripSchema);

function indexTrips(): Promise<Trip[]> {
    return TripModel.find()
        .then((trips) => {
            if (trips.length === 0) {
                return []; // Return an empty array if no trips are found
            }
            return trips;
        });
}

function getTrip(tripId: string): Promise<Trip> {
    return TripModel.findOne({ tripId })
        .then((trip) => {
            if (!trip) throw `Trip ${tripId} not found`;
            return trip;
        });
}

function createTrip(trip: Trip): Promise<Trip> {
    const newTrip = new TripModel(trip);
    return newTrip.save();
}

function updateTrip(tripId: string, trip: Partial<Trip>): Promise<Trip> {
    return TripModel.findOneAndUpdate({ tripId }, trip, { new: true })
        .then((updatedTrip) => {
            if (!updatedTrip) throw `Trip ${tripId} not updated`;
            return updatedTrip;
        });
}

function deleteTrip(tripId: string): Promise<void> {
    return TripModel.findOneAndDelete({ tripId })
        .then((deletedTrip) => {
            if (!deletedTrip) throw `Trip ${tripId} not deleted`;
        });
}

function getCity(tripId: string, cityName: string): Promise<City> {
    return TripModel.findOne({ tripId, "cities.cityName": cityName }, { "cities.$": 1 })
        .then((trip) => {
            if (!trip) throw `City ${cityName} not found in Trip ${tripId}`;
            if (!trip.cities) throw `City ${cityName} not found in Trip ${tripId}`;
            return trip.cities[0];
        });
}

function addCity(tripId: string, city: City): Promise<City> {
    return TripModel.findOneAndUpdate(
        { tripId },
        { $push: { cities: city } },
        { new: true }
    )
        .then((updatedTrip) => {
            if (!updatedTrip) throw `Trip ${tripId} not updated`;
            return city;
        });
}

function updateCity(tripId: string, cityName: string, city: Partial<City>): Promise<City> {
    return TripModel.findOneAndUpdate(
        { tripId, "cities.cityName": cityName },
        { $set: { "cities.$": city } },
        { new: true }
    )
        .then((updatedTrip) => {
            if (!updatedTrip) throw `City ${cityName} not updated in Trip ${tripId}`;
            if (!updatedTrip.cities) throw `City ${cityName} not found in Trip ${tripId}`;
            return updatedTrip.cities.find((c) => c.cityName === cityName) as City;
        });
}

function removeCity(tripId: string, cityName: string): Promise<void> {
    return TripModel.findOneAndUpdate(
        { tripId },
        { $pull: { cities: { cityName } } }
    )
        .then((updatedTrip) => {
            if (!updatedTrip) throw `City ${cityName} not removed from Trip ${tripId}`;
        });
}

export default {
    indexTrips,
    getTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    getCity,
    addCity,
    updateCity,
    removeCity,
};