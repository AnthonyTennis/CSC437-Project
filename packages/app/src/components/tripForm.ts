// src/tripForm.ts
import { LitElement, css, html } from "lit";
import { Observer } from "@calpoly/mustang";

export class TripFormElement extends LitElement {
    static styles = css`
        /* Add your styles here */
    `;

    _authObserver = new Observer(this, "blazing:auth");

    get authorization() {
        return (
            this._user?.authenticated && {
                Authorization: `Bearer ${this._user.token}`
            }
        );
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
            this._user = user;
            this.loadTrips();
        });
    }

    async loadTrips() {
        try {
            const response = await fetch("/api/trips", {
                headers: this.authorization
            });
            const trips = await response.json();
            this.renderTrips(trips);
        } catch (error) {
            console.error("Error loading trips:", error);
        }
    }

    renderTrips(trips) {
        const tripList = document.getElementById("trip-list");
        tripList.innerHTML = "";

        trips.forEach(trip => {
            const tripElement = document.createElement("div");
            tripElement.innerHTML = `
                <h3>${trip.tripName}</h3>
                <p>Start Date: ${new Date(trip.startDate).toLocaleDateString()}</p>
                <h4>Cities:</h4>
                <ul>
                    ${trip.cities.map(city => `
                        <li>
                            ${city.cityName} - ${city.numDays} days
                            <button data-trip-id="${trip.tripId}" data-city-name="${city.cityName}">Remove City</button>
                        </li>
                    `).join("")}
                </ul>
                <form data-trip-id="${trip.tripId}">
                    <label>
                        <span>City Name:</span>
                        <input name="cityName" required>
                    </label>
                    <label>
                        <span>Number of Days:</span>
                        <input type="number" name="numDays" required>
                    </label>
                    <button type="submit">Add City</button>
                </form>
                <button data-trip-id="${trip.tripId}">Delete Trip</button>
            `;

            tripElement.querySelector("form").addEventListener("submit", this.addCity.bind(this));
            tripElement.querySelector(`button[data-trip-id="${trip.tripId}"]`).addEventListener("click", this.deleteTrip.bind(this));

            tripElement.querySelectorAll(`button[data-trip-id="${trip.tripId}"][data-city-name]`).forEach(button => {
                button.addEventListener("click", this.removeCity.bind(this));
            });

            tripList.appendChild(tripElement);
        });
    }

    async createTrip(event) {
        event.preventDefault();
        const form = event.target;
        const tripData = {
            tripName: form.tripName.value,
            startDate: form.startDate.value,
            cities: []
        };

        try {
            const response = await fetch("/api/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...this.authorization
                },
                body: JSON.stringify(tripData)
            });

            if (response.ok) {
                form.reset();
                this.loadTrips();
            } else {
                console.error("Error creating trip:", response.statusText);
            }
        } catch (error) {
            console.error("Error creating trip:", error);
        }
    }

    async addCity(event) {
        event.preventDefault();
        const form = event.target;
        const tripId = form.dataset.tripId;
        const cityData = {
            cityName: form.cityName.value,
            numDays: parseInt(form.numDays.value)
        };

        try {
            const response = await fetch(`/api/trips/${tripId}/cities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...this.authorization
                },
                body: JSON.stringify(cityData)
            });

            if (response.ok) {
                form.reset();
                this.loadTrips();
            } else {
                console.error("Error adding city:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding city:", error);
        }
    }

    async deleteTrip(event) {
        const tripId = event.target.dataset.tripId;

        try {
            const response = await fetch(`/api/trips/${tripId}`, {
                method: "DELETE",
                headers: this.authorization
            });

            if (response.ok) {
                this.loadTrips();
            } else {
                console.error("Error deleting trip:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting trip:", error);
        }
    }

    async removeCity(event) {
        const tripId = event.target.dataset.tripId;
        const cityName = event.target.dataset.cityName;

        try {
            const response = await fetch(`/api/trips/${tripId}/cities/${cityName}`, {
                method: "DELETE",
                headers: this.authorization
            });

            if (response.ok) {
                this.loadTrips();
            } else {
                console.error("Error removing city:", response.statusText);
            }
        } catch (error) {
            console.error("Error removing city:", error);
        }
    }

    render() {
        return html`
            <form @submit=${this.createTrip}>
                <slot></slot>
            </form>
        `;
    }
}

customElements.define("trip-form", TripFormElement);