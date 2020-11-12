var getUserRepos = function() {
    // console.log("function was called");
    var response = fetch("https://api.github.com/users/octocat/repos");
    console.log(response);
};

getUserRepos();