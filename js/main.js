// js/main.js - Main website functionality
// Display current date
const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
const today = new Date();
document.getElementById('current-date').textContent = today.toLocaleDateString('en-US', options);
// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
// Helper function to get first 85 words
function getFirst85Words(text) {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.slice(0, 85).join(' ') + (words.length > 85 ? '...' : '');
}
// Load articles from data structure
function loadArticles() {
  if (typeof articlesData === 'undefined' || !articlesData.length) {
    console.error('No articles data found');
    return;
  }
  // Sort articles by date (most recent first)
  const sortedArticles = [...articlesData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  // Get the most recent article as main story
  const mainStoryArticle = sortedArticles[0];
  
  // Get the next 15 articles for the grid (5 rows of 3)
  const gridArticles = sortedArticles.slice(1, 16);
  // Render main story
  const mainStoryHTML = `
    <div class="main-story-content">
      <h1><a href="article.html?id=${mainStoryArticle.id}" style="text-decoration: none; color: inherit;">${mainStoryArticle.title}</a></h1>
      <p class="summary">${mainStoryArticle.description}</p>
      <div class="byline"><strong>${mainStoryArticle.author}</strong> • ${mainStoryArticle.displayDate}</div>
      <p>${getFirst85Words(mainStoryArticle.content)}</p>
    </div>
    <div class="main-story-image">
      <img src="${mainStoryArticle.image}" alt="${mainStoryArticle.title}">
    </div>
  `;
  document.getElementById('mainStory').innerHTML = mainStoryHTML;
  // Render grid articles
  const gridStoriesHTML = gridArticles.map(article => `
    <article class="story-card">
      <a href="article.html?id=${article.id}">
        <img src="${article.image}" alt="${article.title}">
      </a>
      <h2><a href="article.html?id=${article.id}">${article.title}</a></h2>
      <div class="byline"><strong>${article.author}</strong> • ${article.displayDate}</div>
      <p>${article.description}</p>
    </article>
  `).join('');
  document.getElementById('gridStories').innerHTML = gridStoriesHTML;
}
// Load articles when page loads
document.addEventListener('DOMContentLoaded', loadArticles);
