"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var trips_svc_exports = {};
__export(trips_svc_exports, {
  default: () => trips_svc_default
});
module.exports = __toCommonJS(trips_svc_exports);
var import_mongoose = require("mongoose");
const CitySchema = new import_mongoose.Schema({
  cityName: { type: String, required: true, trim: true },
  numDays: { type: Number, required: true },
  modeOfTransport: { type: String, required: true, trim: true }
});
const TripSchema = new import_mongoose.Schema({
  tripId: { type: String, required: true, trim: true },
  tripName: { type: String, required: true, trim: true },
  cities: [CitySchema],
  startDate: { type: Date, required: true },
  departureAirport: { type: String, required: true, trim: true }
});
const TripModel = (0, import_mongoose.model)("Trip", TripSchema);
function indexTrips() {
  return TripModel.find().then((trips) => {
    if (trips.length === 0) {
      return [];
    }
    return trips;
  });
}
function getTrip(tripId) {
  return TripModel.findOne({ tripId }).then((trip) => {
    if (!trip) throw `Trip ${tripId} not found`;
    return trip;
  });
}
function createTrip(trip) {
  const newTrip = new TripModel(trip);
  return newTrip.save();
}
function updateTrip(tripId, trip) {
  return TripModel.findOneAndUpdate({ tripId }, trip, { new: true }).then((updatedTrip) => {
    if (!updatedTrip) throw `Trip ${tripId} not updated`;
    return updatedTrip;
  });
}
function deleteTrip(tripId) {
  return TripModel.findOneAndDelete({ tripId }).then((deletedTrip) => {
    if (!deletedTrip) throw `Trip ${tripId} not deleted`;
  });
}
function getCity(tripId, cityName) {
  return TripModel.findOne({ tripId, "cities.cityName": cityName }, { "cities.$": 1 }).then((trip) => {
    if (!trip) throw `City ${cityName} not found in Trip ${tripId}`;
    if (!trip.cities) throw `City ${cityName} not found in Trip ${tripId}`;
    return trip.cities[0];
  });
}
function addCity(tripId, city) {
  return TripModel.findOneAndUpdate(
    { tripId },
    { $push: { cities: city } },
    { new: true }
  ).then((updatedTrip) => {
    if (!updatedTrip) throw `Trip ${tripId} not updated`;
    return city;
  });
}
function updateCity(tripId, cityName, city) {
  return TripModel.findOneAndUpdate(
    { tripId, "cities.cityName": cityName },
    { $set: { "cities.$": city } },
    { new: true }
  ).then((updatedTrip) => {
    if (!updatedTrip) throw `City ${cityName} not updated in Trip ${tripId}`;
    if (!updatedTrip.cities) throw `City ${cityName} not found in Trip ${tripId}`;
    return updatedTrip.cities.find((c) => c.cityName === cityName);
  });
}
function removeCity(tripId, cityName) {
  return TripModel.findOneAndUpdate(
    { tripId },
    { $pull: { cities: { cityName } } }
  ).then((updatedTrip) => {
    if (!updatedTrip) throw `City ${cityName} not removed from Trip ${tripId}`;
  });
}
function reorderCities(tripId, newOrder) {
  return __async(this, null, function* () {
    const trip = yield TripModel.findOne({ tripId });
    if (!trip) throw `Trip ${tripId} not found`;
    const cityMap = trip.cities.reduce((map, city) => {
      map[city.cityName] = city;
      return map;
    }, {});
    trip.cities = newOrder.map((cityName) => cityMap[cityName]);
    yield trip.save();
    return trip;
  });
}
var trips_svc_default = {
  indexTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getCity,
  addCity,
  updateCity,
  removeCity,
  reorderCities
};
