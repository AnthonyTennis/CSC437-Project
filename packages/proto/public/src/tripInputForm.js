import { prepareTemplate } from "./template.js";
import { Auth, Observer } from "@calpoly/mustang";

export class TripInputFormElement extends HTMLElement {
  static template = prepareTemplate(`
    <template>
      <aside>
        <h2>Create New Trip</h2>
        <form id="create-trip-form">
          <label class="form-label">
            <span>Trip Name:</span>
            <input name="tripName" required>
          </label>
          <label class="form-label">
            <span>Start Date:</span>
            <input type="date" name="startDate" required>
          </label>
          <button type="submit" class="form-button">Create Trip</button>
        </form>
      </aside>
      <style>${TripInputFormElement.styles}</style>
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

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      TripInputFormElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    this.shadowRoot.getElementById("create-trip-form").addEventListener("submit", this.handleCreateTrip.bind(this));
  }

  async handleCreateTrip(event) {
    event.preventDefault();
    const form = event.target;
    const tripData = {
      tripId: this.generateTripId(),
      tripName: form.tripName.value,
      startDate: form.startDate.value,
      cities: []
    };

    try {
      const response = await fetch("/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        form.reset();
        this.dispatchEvent(new CustomEvent("trip-created", { bubbles: true, composed: true }));
      } else {
        console.error("Error creating trip:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  }

  generateTripId() {
    return Math.random().toString(36).substring(7);
  }
}

customElements.define("trip-input-form", TripInputFormElement);
