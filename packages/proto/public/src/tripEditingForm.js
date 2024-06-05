import { prepareTemplate } from "./template.js";
import { Auth, Observer } from "@calpoly/mustang";

export class TripEditingFormElement extends HTMLElement {
  static template = prepareTemplate(`
    <template>
      <div id="trip-list"></div>
      <style>${TripEditingFormElement.styles}</style>
    </template>
  `);

  static styles = `
    .form-label {
      display: block;
      margin-bottom: 15px;
    }
    .form-label span {
      display: block;
      margin-bottom: 5px;
    }
    .form-button {
      display: inline-block;
      margin: 10px 0;
      padding: 10px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .form-button:hover {
      background-color: #45a049;
    }
    aside {
      margin-bottom: 20px;
    }
  `;

  _authObserver = new Observer(this, "blazing:auth");
  authorization = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      TripEditingFormElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      if (user.authenticated) {
        this.authorization = { Authorization: `Bearer ${user.token}` };
        this.loadTrips();
      } else {
        this.authorization = null;
        this.shadowRoot.getElementById("trip-list").innerHTML = "<p>Please log in to view your trips.</p>";
      }
    });

    this.shadowRoot.getElementById("trip-list").addEventListener("submit", this.handleAddCity.bind(this));
    this.shadowRoot.getElementById("trip-list").addEventListener("click", this.handleButtonClick.bind(this));
  }

  async handleAddCity(event) {
    if (event.target.matches("form")) {
      event.preventDefault();
      const form = event.target;
      const tripId = form.dataset.tripId;
      const cityData = {
        cityName: form.cityName.value,
        numDays: parseInt(form.numDays.value)
      };

      try {
        const response = await fetch(`/trips/${tripId}/cities`, {
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
  }

  async handleButtonClick(event) {
    const tripId = event.target.dataset.tripId;
    const cityName = event.target.dataset.cityName;

    if (event.target.matches("button[data-trip-id][data-city-name]")) {
      try {
        const response = await fetch(`/trips/${tripId}/cities/${cityName}`, {
          method: "DELETE",
          headers: {
            ...this.authorization
          }
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

    if (event.target.matches("button[data-trip-id]")) {
      try {
        const response = await fetch(`/trips/${tripId}`, {
          method: "DELETE",
          headers: {
            ...this.authorization
          }
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
  }

  async loadTrips() {
    if (!this.authorization) {
      this.shadowRoot.getElementById('trip-list').innerHTML = "<p>Please log in to view your trips.</p>";
      return;
    }

    try {
      const response = await fetch("/trips", {
        headers: {
          ...this.authorization
        }
      });

      if (response.ok) {
        const trips = await response.json();
        if (trips.length === 0) {
          console.log("No trips found.");
        }
        this.renderTrips(trips);
      } else {
        console.error("Error loading trips:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error loading trips:", error.message, error.stack);
    }
  }

  renderTrips(trips) {
    const tripList = this.shadowRoot.getElementById('trip-list');
    tripList.innerHTML = "";

    trips.forEach(trip => {
      const tripElement = document.createElement("div");
      tripElement.innerHTML = `
        <aside>
          <h3>${trip.tripName}</h3>
          <p>Start Date: ${new Date(trip.startDate).toLocaleDateString()}</p>
          <p>Duration: ${trip.cities.reduce((total, city) => total + city.numDays, 0)} days</p>
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
            <label class="form-label">
              <span>City Name:</span>
              <input name="cityName" required>
            </label>
            <label class="form-label">
              <span>Number of Days:</span>
              <input type="number" name="numDays" required>
            </label>
            <button type="submit" class="form-button">Add City</button>
          </form>
          <button data-trip-id="${trip.tripId}" class="form-button">Delete Trip</button>
        </aside>
      `;

      tripList.appendChild(tripElement);
    });
  }
}

customElements.define("trip-editing-form", TripEditingFormElement);
