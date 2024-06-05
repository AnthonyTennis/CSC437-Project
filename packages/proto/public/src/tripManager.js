// src/tripManager.js
document.addEventListener("DOMContentLoaded", () => {
    const createTripForm = document.getElementById("create-trip-form");
    const tripList = document.getElementById("trip-list");

    // Load trips on page load
    loadTrips();

    // Handle create trip form submission
    createTripForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const tripData = {
            tripId: generateTripId(), // Generate a unique tripId
            tripName: createTripForm.tripName.value,
            startDate: createTripForm.startDate.value,
            departureAirport: createTripForm.departureAirport.value,
            cities: []
        };

        try {
            const response = await fetch("/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tripData)
            });

            if (response.ok) {
                createTripForm.reset();
                loadTrips();
            } else {
                console.error("Error creating trip:", response.statusText);
            }
        } catch (error) {
            console.error("Error creating trip:", error);
        }
    });

    // Handle add city form submission
    tripList.addEventListener("submit", async (event) => {
        if (event.target.matches("form[data-trip-id]")) {
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cityData)
                });

                if (response.ok) {
                    form.reset();
                    loadTrips();
                } else {
                    console.error("Error adding city:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding city:", error);
            }
        } else if (event.target.matches("form[data-edit-trip-id]")) {
            event.preventDefault();
            const form = event.target;
            const tripId = form.dataset.editTripId;
            const cityName = form.dataset.editCityName;
            const cityData = {
                cityName: form.editCityName.value, // Include city name in the payload
                numDays: parseInt(form.editNumDays.value)
            };

            try {
                const response = await fetch(`/trips/${tripId}/cities/${cityName}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cityData)
                });

                if (response.ok) {
                    form.remove();
                    loadTrips();
                } else {
                    console.error("Error updating city:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating city:", error);
            }
        }
    });

    // Handle delete trip button click and edit city button click
    tripList.addEventListener("click", async (event) => {
        const tripId = event.target.dataset.tripId;
        const cityName = event.target.dataset.cityName;

        if (event.target.matches("button[data-delete-city]")) {
            // Remove city
            console.log("delete city button clicked.");
            try {
                const response = await fetch(`/trips/${tripId}/cities/${cityName}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    loadTrips();
                } else {
                    console.error("Error removing city:", response.statusText);
                }
            } catch (error) {
                console.error("Error removing city:", error);
            }
        } else if (event.target.matches("button[data-trip-id]:not([data-city-name])")) {
            // Delete trip
            try {
                const response = await fetch(`/trips/${tripId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    loadTrips();
                } else {
                    console.error("Error deleting trip:", response.statusText);
                }
            } catch (error) {
                console.error("Error deleting trip:", error);
            }
        } else if (event.target.matches("button[data-edit-city]")) {
            console.log("Edit city button clicked.");
            // Show edit city form
            const tripId = event.target.dataset.tripId;
            const cityName = event.target.dataset.cityName;
            const numDays = event.target.dataset.numDays;
            const form = document.createElement("form");
            form.dataset.editTripId = tripId;
            form.dataset.editCityName = cityName;
            form.innerHTML = `
                <label>
                    <span>City Name:</span>
                    <input type="text" name="editCityName" value="${cityName}" required>
                </label>
                <label>
                    <span>Number of Days:</span>
                    <input type="number" name="editNumDays" value="${numDays}" required>
                </label>
                <button type="submit">Save</button>
            `;
            event.target.parentElement.appendChild(form);
        }
    });

    // Load trips from the server
    async function loadTrips() {
        try {
            const response = await fetch("/trips");
            if (response.ok) {
                const trips = await response.json();
                if (trips.length === 0) {
                    console.log("No trips found.");
                }
                renderTrips(trips);
            } else {
                console.error("Error loading trips:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error loading trips:", error.message, error.stack);
        }
    }

    // Render trips on the page
    async function renderTrips(trips) {
        tripList.innerHTML = "";

        for (const trip of trips) {
            const tripElement = document.createElement("div");
            tripElement.innerHTML = `
            <aside>
                <h3>${trip.tripName}</h3>
                <p>Departure Airport: ${trip.departureAirport}</p>
                <p>Start Date: ${new Date(trip.startDate).toLocaleDateString()}</p>
                <p>Duration: ${trip.cities.reduce((total, city) => total + city.numDays, 0)} days</p>
                <h4>Cities:</h4>
                <ul id="city-list-${trip.tripId}">
                    ${trip.cities.map(city => `
                        <li data-city-name="${city.cityName}">
                            ${city.cityName} - ${city.numDays} days
                            <button data-delete-city data-trip-id="${trip.tripId}" data-city-name="${city.cityName}">Remove City</button>
                            <button data-edit-city data-trip-id="${trip.tripId}" data-city-name="${city.cityName}" data-num-days="${city.numDays}">Edit City</button>
                        </li>
                    `).join("")}
                </ul>
                <form data-trip-id="${trip.tripId}">
                    <label>
                        <span>City Name:</span>
                        <input name="cityName" required>
                    </label>
                    <p></p>
                    <label>
                        <span>Number of Days:</span>
                        <input type="number" name="numDays" required>
                    </label>
                    <p></p>
                    <button type="submit">Add City</button>
                </form>
                <button data-trip-id="${trip.tripId}">Delete Trip</button>
            </aside>
            `;
            tripList.appendChild(tripElement);

            // Initialize Sortable for city list
            const cityList = document.getElementById(`city-list-${trip.tripId}`);
            Sortable.create(cityList, {
                animation: 150,
                onEnd: async (evt) => {
                    const newOrder = Array.from(cityList.children).map(li => li.dataset.cityName);
                    await updateCityOrder(trip.tripId, newOrder);
                }
            });
        }
    }

    // Update city order in the backend
    async function updateCityOrder(tripId, newOrder) {
        try {
            const response = await fetch(`/trips/${tripId}/reorder`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newOrder })
            });

            if (!response.ok) {
                console.error("Error updating city order:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating city order:", error);
        }
    }

    // Generate a unique tripId
    function generateTripId() {
        return Math.random().toString(36).substring(7);
    }
});
