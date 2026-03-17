// =============================================================
// ajax-activities.js
// This file contains all AJAX examples for the Jane Doe 
// portfolio website. Each section is one AJAX activity.
// =============================================================


// =============================================================
// ACTIVITY 1: Load Projects from a Local JSON File
// Technique: fetch() with GET request to a local file
// Trigger: Fires automatically when the page loads
// =============================================================

function loadProjects() {
  // Step 1: Find the container in our HTML where projects will go
  const projectsContainer = document.getElementById("ajax-projects-container");

  // Step 2: Show a "loading" message while we wait for data
  projectsContainer.innerHTML = `
    <div class="loading-message">
      <p>⏳ Loading projects...</p>
    </div>`;

  // Step 3: Use fetch() to request our local JSON file
  // fetch() returns a Promise — it says "I'll give you the data soon"
  fetch("data/projects.json")
    .then(function (response) {
      // Step 4: Check if the request was successful (status 200)
      if (!response.ok) {
        throw new Error("Could not load projects. Status: " + response.status);
      }
      // Step 5: Convert the response to a JavaScript object (from JSON text)
      return response.json();
    })
    .then(function (data) {
      // Step 6: We have the data! Now let's build the HTML
      let htmlOutput = "";

      // Loop through each project in the array
      data.projects.forEach(function (project) {
        // Build a badge for each technology used
        let techBadges = "";
        project.tech.forEach(function (techItem) {
          techBadges += `<span class="tech-badge">${techItem}</span>`;
        });

        // Build the full card for this project
        htmlOutput += `
          <div class="ajax-project-card" id="project-${project.id}">
            <div class="project-card-header">
              <h3>${project.title}</h3>
              <span class="status-badge status-${project.status}">
                ${project.status === "completed" ? "✅ Completed" : "🔧 In Progress"}
              </span>
            </div>
            <p>${project.description}</p>
            <div class="tech-stack">
              ${techBadges}
            </div>
            <a href="${project.github}" target="_blank" class="project-link">
              View on GitHub →
            </a>
          </div>`;
      });

      // Step 7: Inject all the built HTML into the page
      projectsContainer.innerHTML = htmlOutput;
    })
    .catch(function (error) {
      // Step 8: Handle any errors (network issues, bad JSON, etc.)
      projectsContainer.innerHTML = `
        <div class="error-message">
          <p>❌ Oops! Could not load projects. Error: ${error.message}</p>
          <p>Make sure the data/projects.json file exists and the server is running.</p>
        </div>`;
    });
}


// =============================================================
// ACTIVITY 2: Fetch a Random Programming Quote from a Public API
// Technique: fetch() with GET request to an external API
// Trigger: Button click ("Get Inspiration")
// =============================================================

function fetchRandomQuote() {
  // Step 1: Find the elements we need on the page
  const quoteDisplay = document.getElementById("quote-display");
  const quoteButton = document.getElementById("quote-btn");

  // Step 2: Update the button and show loading state
  quoteButton.disabled = true;
  quoteButton.textContent = "Fetching...";
  quoteDisplay.innerHTML = `<p class="loading-message">⏳ Finding a great quote for you...</p>`;

  // Step 3: We'll use the quotable.io public API
  // This API returns a random quote as JSON — no API key needed!
  fetch("https://api.quotable.io/random?tags=technology,inspirational")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API request failed with status: " + response.status);
      }
      return response.json();
    })
    .then(function (quoteData) {
      // Step 4: Display the quote on the page
      quoteDisplay.innerHTML = `
        <blockquote class="fetched-quote">
          <p>"${quoteData.content}"</p>
          — <strong>${quoteData.author}</strong>
        </blockquote>`;

      // Step 5: Re-enable the button for another click
      quoteButton.disabled = false;
      quoteButton.textContent = "Get Another Quote";
    })
    .catch(function (error) {
      // Step 6: If the API is down, show a friendly fallback message
      quoteDisplay.innerHTML = `
        <blockquote class="fetched-quote fallback-quote">
          <p>"The only way to do great work is to love what you do."</p>
          — <strong>Steve Jobs</strong> (Fallback quote — API unavailable)
        </blockquote>`;

      quoteButton.disabled = false;
      quoteButton.textContent = "Try Again";

      console.warn("Quote API error:", error.message);
    });
}


// =============================================================
// ACTIVITY 3: Contact Form with AJAX Submission
// Technique: fetch() with POST request + FormData
// Trigger: Form submit event (no page refresh!)
// =============================================================

function setupContactForm() {
  // Step 1: Get the form element
  const contactForm = document.getElementById("ajax-contact-form");
  const formStatus = document.getElementById("form-status");

  // Step 2: Listen for the form's submit event
  contactForm.addEventListener("submit", function (event) {
    // Step 3: IMPORTANT — prevent the default form behavior
    // Without this line, the page would reload on submit!
    event.preventDefault();

    // Step 4: Gather all form data automatically using FormData
    const formData = new FormData(contactForm);

    // Step 5: Convert FormData to a plain JavaScript object
    // This makes it easy to read and send as JSON
    const formObject = {};
    formData.forEach(function (value, key) {
      formObject[key] = value;
    });

    // Step 6: Basic client-side validation before sending
    if (!formObject.name || !formObject.email || !formObject.message) {
      formStatus.innerHTML = `
        <div class="form-error">
          ⚠️ Please fill out all fields before submitting.
        </div>`;
      return; // Stop here — don't submit
    }

    // Step 7: Show "sending" feedback to the user
    formStatus.innerHTML = `<div class="form-loading">📤 Sending your message...</div>`;
    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;

    // Step 8: Send the data using fetch() with a POST request
    // We're using JSONPlaceholder — a free fake API for testing
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",                        // POST = sending data to server
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
      },
      body: JSON.stringify(formObject),      // Convert our object to JSON text
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Server returned an error: " + response.status);
        }
        return response.json();
      })
      .then(function (responseData) {
        // Step 9: Show a success message and reset the form
        formStatus.innerHTML = `
          <div class="form-success">
            ✅ Thank you, <strong>${formObject.name}</strong>! 
            Your message has been sent. I'll get back to you at 
            <em>${formObject.email}</em> soon.
            <br><small>(Server confirmed with ID: ${responseData.id})</small>
          </div>`;

        contactForm.reset(); // Clear all the form fields
        submitButton.disabled = false;
      })
      .catch(function (error) {
        // Step 10: Handle submission errors
        formStatus.innerHTML = `
          <div class="form-error">
            ❌ Something went wrong. Please try again later.
            <br><small>Error details: ${error.message}</small>
          </div>`;
        submitButton.disabled = false;
      });
  });
}


// =============================================================
// ACTIVITY 4: Live GitHub Profile Stats Fetcher
// Technique: fetch() with GET to GitHub's public API
// Trigger: Button click ("Load GitHub Stats")
// =============================================================

function fetchGitHubStats() {
  const statsContainer = document.getElementById("github-stats-container");
  const loadStatsBtn = document.getElementById("load-stats-btn");
  
  // The GitHub username to look up
  const username = "rifatsm"; // Change this to any GitHub username!

  // Step 1: Show loading state
  loadStatsBtn.disabled = true;
  loadStatsBtn.textContent = "Loading...";
  statsContainer.innerHTML = `<p class="loading-message">⏳ Fetching GitHub data for @${username}...</p>`;

  // Step 2: Make a GET request to GitHub's public API
  // No API key needed for basic public data!
  fetch(`https://api.github.com/users/${username}`)
    .then(function (response) {
      if (!response.ok) {
        // GitHub returns 404 if the user doesn't exist
        if (response.status === 404) {
          throw new Error(`User "${username}" not found on GitHub.`);
        }
        throw new Error("GitHub API error. Status: " + response.status);
      }
      return response.json();
    })
    .then(function (userData) {
      // Step 3: Also fetch their repositories (chaining two AJAX calls!)
      return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
        .then(function (repoResponse) {
          return repoResponse.json();
        })
        .then(function (repoData) {
          // Step 4: Combine user data and repo data together
          return { user: userData, repos: repoData };
        });
    })
    .then(function (combinedData) {
      const user = combinedData.user;
      const repos = combinedData.repos;

      // Step 5: Build the repo list HTML
      let repoListHTML = "";
      repos.forEach(function (repo) {
        repoListHTML += `
          <li>
            <a href="${repo.html_url}" target="_blank">📁 ${repo.name}</a>
            <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
          </li>`;
      });

      // Step 6: Display the full GitHub profile card
      statsContainer.innerHTML = `
        <div class="github-card">
          <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="github-avatar" />
          <div class="github-info">
            <h3>${user.name || user.login}</h3>
            <p class="github-bio">${user.bio || "No bio available."}</p>
            <div class="github-stats-grid">
              <div class="stat-item">
                <span class="stat-number">${user.public_repos}</span>
                <span class="stat-label">Repositories</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${user.followers}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${user.following}</span>
                <span class="stat-label">Following</span>
              </div>
            </div>
            <h4>Recent Repositories:</h4>
            <ul class="repo-list">
              ${repoListHTML}
            </ul>
            <a href="${user.html_url}" target="_blank" class="github-profile-link">
              View Full GitHub Profile →
            </a>
          </div>
        </div>`;

      loadStatsBtn.textContent = "🔄 Refresh Stats";
      loadStatsBtn.disabled = false;
    })
    .catch(function (error) {
      statsContainer.innerHTML = `
        <div class="error-message">
          ❌ Could not load GitHub stats. ${error.message}
        </div>`;
      loadStatsBtn.textContent = "Try Again";
      loadStatsBtn.disabled = false;
    });
}


// =============================================================
// ACTIVITY 5: Live Search / Filter with AJAX
// Technique: fetch() triggered by keyboard input (real-time)
// Trigger: User typing in a search box (with debouncing)
// =============================================================

function setupLiveSearch() {
  const searchInput = document.getElementById("skill-search");
  const searchResults = document.getElementById("search-results");

  // Step 1: We use a technique called "debouncing"
  // This means we wait until the user STOPS typing (500ms)
  // before making the API call. This prevents too many requests!
  let debounceTimer;

  searchInput.addEventListener("input", function () {
    // Step 2: Clear the previous timer every time the user types
    clearTimeout(debounceTimer);

    const searchTerm = searchInput.value.trim();

    // Step 3: If the box is empty, clear results and stop
    if (searchTerm.length === 0) {
      searchResults.innerHTML = `<p class="search-placeholder">Start typing to search...</p>`;
      return;
    }

    // Step 4: Show "searching" feedback immediately
    searchResults.innerHTML = `<p class="loading-message">🔍 Searching for "${searchTerm}"...</p>`;

    // Step 5: Set a new timer — only fires if user stops typing
    debounceTimer = setTimeout(function () {
      // Step 6: We'll use the Wikipedia API to search for tech topics
      // This is a great free API with no key required!
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=5&namespace=0&format=json&origin=*`;

      fetch(apiUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Search API failed.");
          }
          return response.json();
        })
        .then(function (results) {
          // Wikipedia API returns an array:
          // results[0] = search term
          // results[1] = array of titles
          // results[2] = array of descriptions
          // results[3] = array of URLs

          const titles = results[1];
          const descriptions = results[2];
          const urls = results[3];

          // Step 7: Check if there are any results
          if (titles.length === 0) {
            searchResults.innerHTML = `
              <p class="no-results">No results found for "${searchTerm}". Try another term!</p>`;
            return;
          }

          // Step 8: Build the results list
          let resultsHTML = `<p class="results-count">Found ${titles.length} results:</p><ul class="search-results-list">`;

          for (let i = 0; i < titles.length; i++) {
            resultsHTML += `
              <li class="search-result-item">
                <a href="${urls[i]}" target="_blank">
                  <strong>${titles[i]}</strong>
                </a>
                <p>${descriptions[i] || "No description available."}</p>
              </li>`;
          }

          resultsHTML += "</ul>";

          // Step 9: Show the results
          searchResults.innerHTML = resultsHTML;
        })
        .catch(function (error) {
          searchResults.innerHTML = `
            <div class="error-message">
              ❌ Search failed. Please check your internet connection.
              <br><small>${error.message}</small>
            </div>`;
        });
    }, 500); // Wait 500 milliseconds after user stops typing
  });
}


// =============================================================
// INITIALIZE ALL ACTIVITIES
// This runs once the entire HTML page has fully loaded
// =============================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Page loaded! Initializing AJAX activities...");

  // Activity 1: Load projects right away (no click needed)
  loadProjects();

  // Activity 2: Quote button listener
  const quoteBtn = document.getElementById("quote-btn");
  if (quoteBtn) {
    quoteBtn.addEventListener("click", fetchRandomQuote);
  }

  // Activity 3: Set up the contact form handler
  setupContactForm();

  // Activity 4: GitHub stats button listener
  const githubBtn = document.getElementById("load-stats-btn");
  if (githubBtn) {
    githubBtn.addEventListener("click", fetchGitHubStats);
  }

  // Activity 5: Set up the live search box
  setupLiveSearch();

  console.log("✅ All AJAX activities are ready!");
});