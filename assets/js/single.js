const issuesContainerEl = document.querySelector("#issues-container");
const limitWarningEl = document.querySelector("#limit-warning");

let getRepoIssues = function(repo) {
    // concatenate the strings with the repo username and repo name passed in the center
    let apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);

                // if api has paginated additional issues, display warning
                if (response.headers.get("Link")) {
                    displayWarning(repo)
                }
            });
        } else {
            // response failed
            alert("There was a problem with your request!");
        }
    });
};

// turn api data into DOM elements
let displayIssues = function(issues) {

    // if issue[i] === 0 return notification
    if (issues.length === 0) {
        issuesContainerEl.textContent = "Currently this repository has no open issues!";
        return;
    }

    for (let i = 0; i < issues.length; i++) {
       // create a link element to take the users to singular issue on GitHub
       var issueEl = document.createElement("a");
       issueEl.classList = "list-item flex-row justify-space-between align-center";
       issueEl.setAttribute("href", issues[i].html_url);
       issueEl.setAttribute("target", "_blank"); 

       // create a span to hold issue title 
       let titleEl = document.createElement("span");
       titleEl.textContent = issues[i].title;

       // append to the container 
       issueEl.appendChild(titleEl);

       // create a type element
       let typeEl = document.createElement("span");

       // check if issue is an actual issue or a pull request 
       if (issues[i].pull_request) {
        typeEl.textContent = "(Pull Request)";
       } else {
        typeEl.textContent = "(Issue)";
       }

       // append to the container
       issueEl.appendChild(typeEl);

       issuesContainerEl.append(issueEl);
    }
}

// if issues are being paginated, inform the user
let displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
    let linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append warning message to container
    limitWarningEl.appendChild(linkEl);
};

getRepoIssues("facebook/react");