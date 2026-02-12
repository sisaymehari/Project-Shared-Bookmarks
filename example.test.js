// Simple localStorage mock for Node
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

import assert from "node:assert";
import test from "node:test";
import { getData, setData } from "./storage.js";
import { addBookmark, isValidUrl } from "./script.js";

// 1. Adding a bookmark stores correct data

test("Adding a bookmark stores correct data structure", () => {
  const userId = "user1";
  setData(userId, []);

  addBookmark(userId, "Test Title", "https://example.com", "Test description");

  const bookmarks = getData(userId);

  assert.equal(bookmarks.length, 1);
  assert.equal(bookmarks[0].title, "Test Title");
  assert.equal(bookmarks[0].url, "https://example.com");
  assert.equal(bookmarks[0].description, "Test description");
  assert.equal(bookmarks[0].likes, 0);
  assert.ok(bookmarks[0].id);
});

// 2. URL validation logic

test("URL validation correctly accepts and rejects URLs", () => {
  assert.equal(isValidUrl("https://example.com"), true);
  assert.equal(isValidUrl("http://example.com"), true);
  assert.equal(isValidUrl("ftp://example.com"), false);
  assert.equal(isValidUrl("not-a-url"), false);
});

// 3. Bookmarks include a valid timestamp

test("Bookmarks are created with a valid timestamp used for sorting", () => {
  const userId = "user-time";
  setData(userId, []);

  addBookmark(userId, "Title", "https://example.com", "Desc");

  const bookmarks = getData(userId);
  const timestamp = bookmarks[0].timestamp;

  // Ensure timestamp exists
  assert.ok(timestamp);

  // Ensure timestamp is a valid date
  assert.equal(isNaN(Date.parse(timestamp)), false);
});
