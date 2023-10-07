// Define constants for GitHub API endpoints
const GITHUB_API_URL = 'https://api.github.com';
const USER_SEARCH_ENDPOINT = '/search/users';
const USER_REPOS_ENDPOINT = '/users';

// Get references to HTML elements
const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

// Function to fetch user data from GitHub API
async function searchUsers(username) {
  try {
    const response = await fetch(`${GITHUB_API_URL}${USER_SEARCH_ENDPOINT}?q=${username}`);
    const data = await response.json();
    
    // Clear previous search results
    userList.innerHTML = '';

    if (data.items) {
      data.items.forEach((user) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" />
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        // Add a click event to load user repositories
        listItem.addEventListener('click', () => {
          fetchUserRepos(user.login);
        });
        userList.appendChild(listItem);
      });
    } else {
      userList.innerHTML = '<li>No users found</li>';
    }
  } catch (error) {
    console.error('Error searching users:', error);
  }
}

// Function to fetch user repositories from GitHub API
async function fetchUserRepos(username) {
  try {
    const response = await fetch(`${GITHUB_API_URL}${USER_REPOS_ENDPOINT}/${username}/repos`);
    const repos = await response.json();
    
    // Clear previous user repositories
    reposList.innerHTML = '';

    repos.forEach((repo) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      reposList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching user repositories:', error);
  }
}

// Event listener for form submission
githubForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = searchInput.value.trim();

  if (username) {
    searchUsers(username);
  }
});
