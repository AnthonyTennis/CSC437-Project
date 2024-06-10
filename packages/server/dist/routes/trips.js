"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var trips_exports = {};
__export(trips_exports, {
  default: () => trips_default
});
module.exports = __toCommonJS(trips_exports);
var import_express = __toESM(require("express"));
var import_trips_svc = __toESM(require("../services/trips-svc"));
const router = import_express.default.Router();
router.get("/:tripId", (req, res) => {
  const { tripId } = req.params;
  import_trips_svc.default.getTrip(tripId).then((trip) => res.json(trip)).catch((err) => res.status(404).end());
});
router.post("/", (req, res) => {
  const newTrip = req.body;
  import_trips_svc.default.createTrip(newTrip).then((trip) => res.status(201).send(trip)).catch((err) => res.status(500).send(err));
});
router.get("/", (req, res) => {
  import_trips_svc.default.indexTrips().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.put("/:tripId", (req, res) => {
  const { tripId } = req.params;
  const updatedTrip = req.body;
  import_trips_svc.default.updateTrip(tripId, updatedTrip).then((trip) => res.json(trip)).catch((err) => res.status(404).end());
});
router.delete("/:tripId", (req, res) => {
  const { tripId } = req.params;
  import_trips_svc.default.deleteTrip(tripId).then(() => res.status(204).end()).catch((err) => res.status(404).end());
});
router.get("/:tripId/cities/:cityName", (req, res) => {
  const { tripId, cityName } = req.params;
  import_trips_svc.default.getCity(tripId, cityName).then((city) => res.json(city)).catch((err) => res.status(404).end());
});
router.post("/:tripId/cities", (req, res) => {
  const { tripId } = req.params;
  const newCity = req.body;
  import_trips_svc.default.addCity(tripId, newCity).then((city) => res.status(201).send(city)).catch((err) => res.status(500).send(err));
});
router.put("/:tripId/cities/:cityName", (req, res) => {
  const { tripId, cityName } = req.params;
  const updatedCity = req.body;
  import_trips_svc.default.updateCity(tripId, cityName, updatedCity).then((city) => res.json(city)).catch((err) => res.status(404).end());
});
router.delete("/:tripId/cities/:cityName", (req, res) => {
  const { tripId, cityName } = req.params;
  import_trips_svc.default.removeCity(tripId, cityName).then(() => res.status(204).end()).catch((err) => res.status(404).end());
});
router.put("/:tripId/reorder", (req, res) => {
  const { tripId } = req.params;
  const { newOrder } = req.body;
  import_trips_svc.default.reorderCities(tripId, newOrder).then((trip) => res.json(trip)).catch((err) => res.status(500).send(err));
});
var trips_default = router;
