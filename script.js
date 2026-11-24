const searchForm = document.getElementById("searchForm");

const sourceInput = document.getElementById("source");
const destinationInput = document.getElementById("destination");

const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const trainResults = document.getElementById("trainResults");

const departureFilter = document.getElementById("departureFilter");
const trainTypeFilter = document.getElementById("trainTypeFilter");

let allTrains = [];
let searchedTrains = [];

// Load train data
async function loadTrains() {
    try {
        const response = await fetch("data/trains.json");

        if (!response.ok) {
            throw new Error("Train data not found");
        }

        allTrains = await response.json();

        console.log("Train data loaded successfully!");

    } catch (error) {
        console.error(error);

        statusMessage.textContent =
            "Unable to load train data. Check your JSON file.";
    }
}

// Convert time into minutes
function getMinutes(time) {
    const parts = time.split(":");

    return Number(parts[0]) * 60 + Number(parts[1]);
}

// Calculate journey duration
function getDuration(departure, arrival) {
    let duration = getMinutes(arrival) - getMinutes(departure);

    if (duration < 0) {
        duration += 1440;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return hours + "h " + minutes + "m";
}

// Get departure category
function getDepartureCategory(time) {
    const hour = Number(time.split(":")[0]);

    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";

    return "night";
}

// Display trains
function displayTrains(trains) {
    trainResults.innerHTML = "";

    if (trains.length === 0) {
        statusMessage.textContent =
            "No trains found for your journey.";

        return;
    }

    statusMessage.textContent =
        trains.length + " train(s) found!";

    trains.forEach(function(train) {

        const card = document.createElement("div");

        card.className = "train-card";

        card.innerHTML = `
            <div class="train-top">

                <div>
                    <div class="train-name">
                        ${train.name}
                    </div>

                    <div class="train-number">
                        Train Number: ${train.number}
                    </div>
                </div>

                <span class="train-type">
                    ${train.type}
                </span>

            </div>

            <div class="journey-details">

                <div>
                    <h3>${train.departure}</h3>
                    <p>${train.source}</p>
                </div>

                <div class="duration">
                    ${getDuration(train.departure, train.arrival)}
                    <p>Journey</p>
                </div>

                <div>
                    <h3>${train.arrival}</h3>
                    <p>${train.destination}</p>
                </div>

            </div>
        `;

        trainResults.appendChild(card);
    });
}

// Search button functionality
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const source = sourceInput.value.trim().toLowerCase();
    const destination = destinationInput.value.trim().toLowerCase();

    if (source === destination) {
        statusMessage.textContent =
            "Source and destination cannot be the same.";

        trainResults.innerHTML = "";
        return;
    }

    if (allTrains.length === 0) {
        statusMessage.textContent =
            "Train data is not loaded. Refresh the page.";

        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    searchedTrains = allTrains.filter(function(train) {

        return (
            train.source.toLowerCase() === source &&
            train.destination.toLowerCase() === destination
        );

    });

    applyFilters();

    searchButton.disabled = false;
    searchButton.textContent = "Search Trains";

});

// Apply filters
function applyFilters() {

    const selectedTime = departureFilter.value;
    const selectedType = trainTypeFilter.value;

    const filteredTrains = searchedTrains.filter(function(train) {

        const timeMatch =
            selectedTime === "all" ||
            getDepartureCategory(train.departure) === selectedTime;

        const typeMatch =
            selectedType === "all" ||
            train.type === selectedType;

        return timeMatch && typeMatch;

    });

    displayTrains(filteredTrains);
}

// Filter change events
departureFilter.addEventListener("change", applyFilters);

trainTypeFilter.addEventListener("change", applyFilters);

// Load data when page opens
loadTrains();