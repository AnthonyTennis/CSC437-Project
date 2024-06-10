import express, { Request, Response } from "express";
import trips from "../services/trips-svc";
import { Trip, City } from "../models/trips";

const router = express.Router();

// CRUD operations for Trips

router.get("/:tripId", (req: Request, res: Response) => {
    const { tripId } = req.params;
  
    trips
      .getTrip(tripId)
      .then((trip: Trip) => res.json(trip))
      .catch((err) => res.status(404).end());
});

router.post("/", (req: Request, res: Response) => {
    const newTrip = req.body;
  
    trips
      .createTrip(newTrip)
      .then((trip: Trip) => res.status(201).send(trip))
      .catch((err) => res.status(500).send(err));
});

router.get("/", (req: Request, res: Response) => {
    trips
      .indexTrips()
      .then((list: Trip[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
});

router.put("/:tripId", (req: Request, res: Response) => {
    const { tripId } = req.params;
    const updatedTrip = req.body;
  
    trips
      .updateTrip(tripId, updatedTrip)
      .then((trip: Trip) => res.json(trip))
      .catch((err) => res.status(404).end());
});

router.delete("/:tripId", (req: Request, res: Response) => {
    const { tripId } = req.params;
  
    trips
      .deleteTrip(tripId)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).end());
});

// CRUD operations for Cities within a Trip

router.get("/:tripId/cities/:cityName", (req: Request, res: Response) => {
    const { tripId, cityName } = req.params;
  
    trips
      .getCity(tripId, cityName)
      .then((city: City) => res.json(city))
      .catch((err) => res.status(404).end());
});

router.post("/:tripId/cities", (req: Request, res: Response) => {
    const { tripId } = req.params;
    const newCity = req.body;
  
    trips
      .addCity(tripId, newCity)
      .then((city: City) => res.status(201).send(city))
      .catch((err) => res.status(500).send(err));
});

router.put("/:tripId/cities/:cityName", (req: Request, res: Response) => {
    const { tripId, cityName } = req.params;
    const updatedCity = req.body;
  
    trips
      .updateCity(tripId, cityName, updatedCity)
      .then((city: City) => res.json(city))
      .catch((err) => res.status(404).end());
});

router.delete("/:tripId/cities/:cityName", (req: Request, res: Response) => {
    const { tripId, cityName } = req.params;
  
    trips
      .removeCity(tripId, cityName)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).end());
});

router.put("/:tripId/reorder", (req: Request, res: Response) => {
  const { tripId } = req.params;
  const { newOrder } = req.body;

  trips
    .reorderCities(tripId, newOrder)
    .then((trip: Trip) => res.json(trip))
    .catch((err) => res.status(500).send(err));
});


export default router;
