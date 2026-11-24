
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const source = sourceInput.value.trim().toLowerCase();
    const destination = destinationInput.value.trim().toLowerCase();

    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Available data:", allTrains);

    if (source === destination) {
        statusMessage.textContent =
            "Source and destination cannot be the same.";
        trainResults.innerHTML = "";
        return;
    }

    if (allTrains.length === 0) {
        statusMessage.textContent =
            "Train data is not loaded. Please refresh the page.";
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    statusMessage.textContent = "Searching trains...";

    const filteredTrains = allTrains.filter(function(train) {
        return (
            train.source.trim().toLowerCase() === source &&
            train.destination.trim().toLowerCase() === destination
        );
    });

    displayTrains(filteredTrains);

    searchButton.disabled = false;
    searchButton.textContent = "Search Trains";
});
