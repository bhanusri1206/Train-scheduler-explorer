



const trains = [
    {
        name: "Chennai Express",
        number: "12609",
        from: "Chennai",
        to: "Bengaluru",
        departure: "06:00",
        arrival: "11:30",
        type: "Express"
    },
    {
        name: "Shatabdi Express",
        number: "12007",
        from: "Chennai",
        to: "Bengaluru",
        departure: "07:00",
        arrival: "12:00",
        type: "Superfast"
    },
    {
        name: "Brindavan Express",
        number: "12639",
        from: "Chennai",
        to: "Bengaluru",
        departure: "15:30",
        arrival: "21:00",
        type: "Express"
    },
    {
        name: "Passenger Train",
        number: "56001",
        from: "Chennai",
        to: "Bengaluru",
        departure: "09:00",
        arrival: "17:00",
        type: "Passenger"
    },
    {
        name: "Charminar Express",
        number: "12759",
        from: "Chennai",
        to: "Hyderabad",
        departure: "18:10",
        arrival: "08:00",
        type: "Express"
    },
    {
        name: "Hyderabad Express",
        number: "12603",
        from: "Chennai",
        to: "Hyderabad",
        departure: "16:45",
        arrival: "07:15",
        type: "Superfast"
    },
    {
        name: "Bengaluru Express",
        number: "12608",
        from: "Bengaluru",
        to: "Chennai",
        departure: "06:30",
        arrival: "12:00",
        type: "Express"
    }
];



const fromStation = document.getElementById("fromStation");
const toStation = document.getElementById("toStation");
const journeyDate = document.getElementById("journeyDate");

const searchBtn = document.getElementById("searchBtn");

const timeFilter = document.getElementById("timeFilter");
const typeFilter = document.getElementById("typeFilter");

const trainResults = document.getElementById("trainResults");
const statusMessage = document.getElementById("statusMessage");



const today = new Date();

const todayString =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

journeyDate.min = todayString;
journeyDate.value = todayString;



let searchedTrains = [];



function calculateDuration(departure, arrival) {

    const [dh, dm] = departure.split(":").map(Number);
    const [ah, am] = arrival.split(":").map(Number);

    const start = dh * 60 + dm;

    let end = ah * 60 + am;

    if (end < start) {
        end += 24 * 60;
    }

    const totalMinutes = end - start;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}



function displayTrains(trainList) {

    trainResults.innerHTML = "";

    if (trainList.length === 0) {
        statusMessage.textContent =
            "No trains found. Try different stations or filters.";
        return;
    }

    statusMessage.textContent =
        `Found ${trainList.length} train(s).`;

    trainList.forEach(function(train) {

        const card = document.createElement("div");

        card.className = "train-card";

        card.innerHTML = `
            <div class="train-header">
                <div>
                    <h3>${train.name}</h3>
                    <p class="train-number">
                        Train No: ${train.number}
                    </p>
                </div>
                <span class="train-type">${train.type}</span>
            </div>

            <div class="journey">

                <div>
                    <p class="journey-time">${train.departure}</p>
                    <p class="station">${train.from}</p>
                </div>

                <div class="duration">
                    <p>${calculateDuration(train.departure, train.arrival)}</p>
                    <div class="line"></div>
                    <p>Duration</p>
                </div>

                <div>
                    <p class="journey-time">${train.arrival}</p>
                    <p class="station">${train.to}</p>
                </div>

            </div>
        `;

        trainResults.appendChild(card);
    });
}



function searchTrains() {

    const from = fromStation.value.trim().toLowerCase();
    const to = toStation.value.trim().toLowerCase();
    const date = journeyDate.value;

    trainResults.innerHTML = "";

    if (!from || !to || !date) {
        statusMessage.textContent =
            "Please enter all journey details.";
        return;
    }

    if (from === to) {
        statusMessage.textContent =
            "Source and destination cannot be the same.";
        return;
    }

    if (date < todayString) {
        statusMessage.textContent =
            "Please select a valid future date.";
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    statusMessage.textContent =
        "Loading train schedules...";

    setTimeout(function() {

        searchedTrains = trains.filter(function(train) {

            return train.from.toLowerCase() === from &&
                   train.to.toLowerCase() === to;
        });

        searchBtn.disabled = false;
        searchBtn.textContent = "Search Trains";

        applyFilters();

    }, 600);
}



function applyFilters() {

    const selectedTime = timeFilter.value;
    const selectedType = typeFilter.value;

    const filteredTrains = searchedTrains.filter(function(train) {

        const hour = Number(train.departure.split(":")[0]);

        let matchesTime = true;

        if (selectedTime === "morning") {
            matchesTime = hour >= 5 && hour < 12;
        }
        else if (selectedTime === "afternoon") {
            matchesTime = hour >= 12 && hour < 17;
        }
        else if (selectedTime === "night") {
            matchesTime = hour >= 17 || hour < 5;
        }

        const matchesType =
            selectedType === "all" ||
            train.type === selectedType;

        return matchesTime && matchesType;
    });

    displayTrains(filteredTrains);
}



searchBtn.addEventListener("click", searchTrains);

timeFilter.addEventListener("change", applyFilters);

typeFilter.addEventListener("change", applyFilters);
