let fileType = "mkv|mp4|avi|mov";
let searchEngine = "google";
let searchHistory = [];

function setFiletype(type, category, icon, message) {
    fileType = type;
    document.getElementById("ddbutton").innerHTML = `<span class="glyphicon glyphicon-${icon}"></span> ${category} <span class="caret"></span>`;
}

function setEngine(engine) {
    searchEngine = engine;
    document.getElementById("egbutton").innerHTML = `<span class="glyphicon glyphicon-search"></span> ${engine.charAt(0).toUpperCase() + engine.slice(1)} <span class="caret"></span>`;
}

function startSearch() {
    const query = document.getElementById("query").value;
    const searchQuery = `${query} ${fileType ? "+" + fileType : ""} intitle:index.of`;
    let searchUrl = "";

    // Show the loading spinner
    // document.getElementById("loading-spinner").style.display = "inline-block";

    switch (searchEngine) {
        case "google":
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            break;
        case "bing":
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
            break;
        case "duckduckgo":
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
            break;
        case "ecosia":
            searchUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(searchQuery)}`;
            break;
    }

    // Redirect to the search engine
    window.open(searchUrl, "_blank");

    // Save to search history
    if (!searchHistory.includes(query)) {
        searchHistory.push(query);
        updateHistory();
    }

    // // Hide the loading spinner after the search
    // setTimeout(() => {
    //     document.getElementById("loading-spinner").style.display = "none";
    // }, 1000);
}

function updateHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    searchHistory.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("history-item");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function showSuggestions() {
    const query = document.getElementById("query").value;
    // Here you could implement a real suggestion feature, for now it's left as a placeholder
    console.log("Showing suggestions for: ", query);
}
