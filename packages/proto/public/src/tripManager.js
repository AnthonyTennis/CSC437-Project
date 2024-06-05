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
        }
    });

    // Handle delete trip button click
    tripList.addEventListener("click", async (event) => {
        if (event.target.matches("button[data-trip-id]")) {
            const tripId = event.target.dataset.tripId;

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
        }
    });

    // Handle remove city button click
    tripList.addEventListener("click", async (event) => {
        if (event.target.matches("button[data-trip-id][data-city-name]")) {
            const tripId = event.target.dataset.tripId;
            const cityName = event.target.dataset.cityName;

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
    function renderTrips(trips) {
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
            <aside>
            `;

            tripList.appendChild(tripElement);
        });
    }

    // Generate a unique tripId
    function generateTripId() {
        return Math.random().toString(36).substring(7);
    }
});