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

// 1. Adding a bookmark stores it correctly

test("Adding a bookmark stores it correctly", () => {
  const userId = "1";
  setData(userId, []);

  addBookmark(userId, "Test Title", "https://example.com", "Test description");

  const bookmarks = getData(userId);
  assert.equal(bookmarks.length, 1);
  assert.equal(bookmarks[0].title, "Test Title");
});

// 2. URL validation works

test("URL validation works", () => {
  assert.equal(isValidUrl("https://example.com"), true);
  assert.equal(isValidUrl("http://example.com"), true);
  assert.equal(isValidUrl("ftp://example.com"), false);
  assert.equal(isValidUrl("not-a-url"), false);
});

// 3. Bookmark likes start at 0

test("Bookmark likes start at 0", () => {
  const userId = "2";
  setData(userId, []);
  addBookmark(userId, "Title", "https://example.com", "Desc");

  const bookmarks = getData(userId);
  assert.equal(bookmarks[0].likes, 0);
});

// 4. NON-TRIVIAL TEST: Bookmarks are stored with timestamps
// (used for reverse chronological sorting in the UI)

test("Bookmarks are created with timestamps for sorting", async () => {
  const userId = "3";
  setData(userId, []);

  addBookmark(userId, "First", "https://first.com", "First desc");

  await new Promise((r) => setTimeout(r, 10));

  addBookmark(userId, "Second", "https://second.com", "Second desc");

  const bookmarks = getData(userId);

  const firstTimestamp = new Date(bookmarks[0].timestamp);
  const secondTimestamp = new Date(bookmarks[1].timestamp);

  assert.ok(firstTimestamp instanceof Date);
  assert.ok(secondTimestamp instanceof Date);
  assert.ok(secondTimestamp > firstTimestamp);
});
