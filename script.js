import { getUserIds, getData, setData } from "./storage.js";

let currentUserId = null;

window.onload = function () {
  const users = getUserIds();
  const userSelect = document.getElementById("user-selector");
  const bookmarkForm = document.getElementById("book-form");

  // Populate dropdown with users
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });

  // Handle user selection
  userSelect.addEventListener("change", function () {
    const selectedUserId = this.value;
    if (selectedUserId && selectedUserId !== "Select the User") {
      currentUserId = selectedUserId;
      displayBookmarks(selectedUserId);
    } else {
      currentUserId = null;
      clearBookmarkDisplay();
    }
  });

  // Handle form submission
  bookmarkForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!currentUserId) {
      alert("Please select a user first!");
      return;
    }

    const title = document.getElementById("title").value.trim();
    const url = document.getElementById("url").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !url || !description) {
      alert("Please fill in all fields!");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    addBookmark(currentUserId, title, url, description);

    // Clear form and refresh display
    bookmarkForm.reset();
    displayBookmarks(currentUserId);
  });
};

function displayBookmarks(userId) {
  const bookmarkList = document.querySelector(".bookmark-list");
  const emptyText = bookmarkList.querySelector(".empty-text");

  // Remove existing bookmark items
  const existingBookmarks = bookmarkList.querySelectorAll(".bookmark-item");
  existingBookmarks.forEach((item) => item.remove());

  const bookmarks = getData(userId) || [];

  if (bookmarks.length === 0) {
    emptyText.style.display = "block";
    emptyText.textContent = `No bookmarks yet for User ${userId}.`;
    return;
  }

  emptyText.style.display = "none";

  // Sort bookmarks newest first
  const sortedBookmarks = bookmarks.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  sortedBookmarks.forEach((bookmark) => {
    const bookmarkElement = createBookmarkElement(bookmark, userId);
    bookmarkList.appendChild(bookmarkElement);
  });
}

function createBookmarkElement(bookmark, userId) {
  const div = document.createElement("div");
  div.className = "bookmark-item";

  const timestamp = new Date(bookmark.timestamp).toLocaleString();

  div.innerHTML = `
    <div class="bookmark-title">
      <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer">${
    bookmark.title
  }</a>
    </div>
    <div class="bookmark-description">${bookmark.description}</div>
    <div class="bookmark-meta">
      <span>Created: ${timestamp}</span>
      <div class="bookmark-actions">
        <button class="copy-btn" onclick="copyToClipboard('${
          bookmark.url
        }')">📋 Copy URL</button>
        <button class="like-btn" onclick="toggleLike('${
          bookmark.id
        }', '${userId}')">
          ❤️ <span class="like-count">${bookmark.likes || 0}</span>
        </button>
      </div>
    </div>
  `;

  return div;
}

function addBookmark(userId, title, url, description) {
  const bookmarks = getData(userId) || [];

  const newBookmark = {
    id: generateId(),
    title: title,
    url: url,
    description: description,
    timestamp: new Date().toISOString(),
    likes: 0,
  };

  bookmarks.push(newBookmark);
  setData(userId, bookmarks);
}

function clearBookmarkDisplay() {
  const bookmarkList = document.querySelector(".bookmark-list");
  const emptyText = bookmarkList.querySelector(".empty-text");
  const existingBookmarks = bookmarkList.querySelectorAll(".bookmark-item");

  existingBookmarks.forEach((item) => item.remove());
  emptyText.style.display = "block";
  emptyText.textContent = "No bookmarks yet.";
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Global functions for onclick handlers
window.copyToClipboard = function (url) {
  navigator.clipboard
    .writeText(url)
    .then(() => console.log("URL copied to clipboard!"))
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    });
};

window.toggleLike = function (bookmarkId, userId) {
  const bookmarks = getData(userId) || [];
  const bookmark = bookmarks.find((b) => b.id === bookmarkId);

  if (bookmark) {
    bookmark.likes = (bookmark.likes || 0) + 1;
    setData(userId, bookmarks);
    displayBookmarks(userId);
  }
};
