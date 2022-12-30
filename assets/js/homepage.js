const userFormEl = document.querySelector("#user-form");
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

let displayRepos = function(repos, searchTerm) {
    // console.log(repos);
    // console.log(searchTerm);

    // clear out content
    repoContainerEl.textContent = "";

    repoSearchTerm.textContent = searchTerm

    // loop over the repos
    for (let i = 0; i < repos.length; i++) {
        // format the repo name
        const repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repository
        let repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create spanEl to hold repo name. Repo name is grabbed at the start of this for loop
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.append(titleEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
}

// function that grabs info from github API
let getUserRepos = function(user) {
    // formatting github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make request to url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
    });
};

userFormEl.addEventListener("submit", formSubmitHandler);