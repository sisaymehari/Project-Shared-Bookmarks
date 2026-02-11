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
import { getUserIds, getData, setData } from "./storage.js";
import { addBookmark, isValidUrl, generateId } from "./script.js";

// 1. Check user count

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// 2. Adding a bookmark stores it

test("Adding a bookmark stores it correctly", () => {
  const userId = "user1";
  setData(userId, []);

  addBookmark(userId, "Test Title", "https://example.com", "Test description");

  const bookmarks = getData(userId);
  assert.equal(bookmarks.length, 1);
  assert.equal(bookmarks[0].title, "Test Title");
});

// 3. URL validation works

test("URL validation works", () => {
  assert.equal(isValidUrl("https://example.com"), true);
  assert.equal(isValidUrl("http://example.com"), true);
  assert.equal(isValidUrl("ftp://example.com"), false);
  assert.equal(isValidUrl("not-a-url"), false);
});

// 4. Bookmark has a unique ID

test("Bookmark has a unique ID", () => {
  const userId = "user2";
  setData(userId, []);
  addBookmark(userId, "Title", "https://example.com", "Desc");

  const bookmarks = getData(userId);
  assert.ok(bookmarks[0].id);
  assert.equal(typeof bookmarks[0].id, "string");
});

// 5. Bookmark likes start at 0

test("Bookmark likes start at 0", () => {
  const userId = "user3";
  setData(userId, []);
  addBookmark(userId, "Title", "https://example.com", "Desc");

  const bookmarks = getData(userId);
  assert.equal(bookmarks[0].likes, 0);
});
