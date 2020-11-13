var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


var formSubmitHandler = function(event) {
    event.preventDefault();
    // Get value from input element
    var username = nameInputEl.value.trim();

    // Plugs into our getUserRepos variable and checks for the username
    if (username) {
        getUserRepos(username);
        // Clears out the <input> element's value
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a Github username");
    }
    // console.log(event);
};

var displayRepos = function(repos, searchTerm) {

    // Check if API returned any repos, if none alert user
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found."
        return;
    }

    // Clear old content 
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // Loop over repos
    for (var i = 0; i < repos.length; i++) {
        // Format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // Create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center"
        
        // CReate a span element to hold repository name 
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // Append to container
        repoEl.appendChild(titleEl);

        // Create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // Check if current repo has issues or not and display images to let user know
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // Append container to the DOM 
        repoContainerEl.appendChild(repoEl);
    }
    console.log(repos);
    console.log(searchTerm);
};

var getUserRepos = function(user) {
    
    // Format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // Make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // Request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            }
            else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            // Chains to the '.then()' method
            alert("Unable to connect to Github");
        });
};

userFormEl.addEventListener("submit", formSubmitHandler);