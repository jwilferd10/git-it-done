const userFormEl = document.querySelector("#user-form");
const languageSelectEl = document.getElementById("#languageSelect");
const languageSubmitEl = document.querySelector("#language-submit");
const nameInputEl = document.querySelector("#username");
const repoContainerEl = document.querySelector("#repos-container");
const repoSearchTerm = document.querySelector("#repo-search-term");

// form submit
let formSubmitHandler = function(event) {
    event.preventDefault();

    //get value from input element. Trim excess space
    let username = nameInputEl.value.trim();

    // if there's a value in the username variable
    if (username) {
        // call getUserRepos and pass username as a param
        getUserRepos(username);
        // reset the nameInputEl back to an empty string
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

let buttonClickHandler = function(event) {
    event.preventDefault();

    let language = languageSelectEl.value;
 
    if (language) {
        getFeaturedRepos(language);

        // clear old text
        repoContainerEl.textContent = "";
        languageSelectEl.value = "";
    }
}

let displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear out content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over the repos
    for (let i = 0; i < repos.length; i++) {
        // format the repo name
        const repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repository
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create spanEl to hold repo name. Repo name is grabbed at the start of this for loop
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.append(titleEl);

        // create status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // if current repo has issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        } 

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
}

// function that grabs info from github API
let getUserRepos = function(user) {
    // formatting github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })

       .catch(function(error) {
            alert("Unable to connect to Github");
        }); 
    // end of fetch
};

let getFeaturedRepos = function(language) {
    // github api url with language passed in the middle
    let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data.items, language.toUpperCase());
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })

        .catch(function(error) {
            alert("Unable to connect to Github");
        });
    // end of fetch
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageSubmitEl.addEventListener("click", buttonClickHandler);