const username = "tshelburne99"; // Replace with your GitHub username
const projectList = document.getElementById("project-list");

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
    }
}

function displayProjects(repos) {
    repos.forEach(repo => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card", "col-md-4");
        projectCard.setAttribute("data-aos", "fade-up");
        projectCard.setAttribute("data-aos-duration", "800");
        projectCard.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available."}</p>
            <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        projectList.appendChild(projectCard);
    });
}

fetchGitHubProjects();
