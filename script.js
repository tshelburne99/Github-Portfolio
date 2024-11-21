const username = "tshelburne99";
const projectList = document.getElementById("project-list");

// Predefined colors for programming languages
const languageColors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
    PHP: "#4F5D95",
    TypeScript: "#2b7489",
    Ruby: "#701516",
    Shell: "#89e051",
    Swift: "#ffac45",
    Go: "#00ADD8",
    Kotlin: "#A97BFF",
    default: "#cccccc", // Default color for unknown languages
};

// Fetch GitHub repositories
async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
    }
}

// Fetch language breakdown for each repository
async function fetchLanguages(repo) {
    try {
        const response = await fetch(repo.languages_url);
        const languages = await response.json();

        // Calculate percentage for each language
        const totalBytes = Object.values(languages).reduce((sum, value) => sum + value, 0);
        const languagePercentages = Object.entries(languages).map(([lang, bytes]) => ({
            language: lang,
            percentage: ((bytes / totalBytes) * 100).toFixed(1), // Round to 1 decimal place
        }));

        return languagePercentages;
    } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error);
        return [];
    }
}

// Generate background gradient for languages
function generateGradient(languages) {
    if (languages.length === 0) return languageColors.default;
    const gradientStops = languages
        .map(
            (lang, index) =>
                `${languageColors[lang.language] || languageColors.default} ${index === 0 ? 0 : languages.slice(0, index).reduce((acc, curr) => acc + parseFloat(curr.percentage), 0)}%, 
                ${languageColors[lang.language] || languageColors.default} ${(languages.slice(0, index + 1).reduce((acc, curr) => acc + parseFloat(curr.percentage), 0))}%`
        )
        .join(", ");
    return `linear-gradient(to right, ${gradientStops})`;
}

// Display repositories and their languages
async function displayProjects(repos) {
    for (const repo of repos) {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card", "col-md-4");
        projectCard.setAttribute("data-aos", "fade-up");

        // Fetch language breakdown
        const languages = await fetchLanguages(repo);

        // Generate gradient background
        const gradientBackground = generateGradient(languages);

        // Generate language list HTML
        const languageList = languages
            .map(
                lang =>
                    `<li>${lang.language}: <strong>${lang.percentage}%</strong></li>`
            )
            .join("");

        // Populate project card
        projectCard.style.background = gradientBackground;
        projectCard.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available."}</p>
            <ul>${languageList || "<li>No language data available</li>"}</ul>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
        `;

        projectList.appendChild(projectCard);
    }
}

// Initialize the portfolio
fetchGitHubProjects();
