# TESTING

This document explains how each rubric requirement was tested.

# The website must contain a drop-down which lists five users

We checked that the drop-down is populated using `getUserIds()` from `storage.js`. We confirmed in the browser that the select box shows User 1, User 2, User 3, User 4, and User 5.

# Selecting a user must display the list of bookmarks for the relevant user

We selected different users from the dropdown and verified that the bookmarks shown change depending on the selected user. The function `displayBookmarks(userId)` is called when the selection changes.

# If there are no bookmarks for the selected user, a message is displayed

We selected a user with no stored data and confirmed the message  
"No bookmarks yet for User X." appears on the screen.

# The list of bookmarks must be shown in reverse chronological order

We added multiple bookmarks for the same user and confirmed the most recently created bookmark appears at the top. This is handled by sorting bookmarks by timestamp in `displayBookmarks()`.

# Each bookmark has a title, description and created at timestamp displayed

After adding bookmarks, we checked that:

- The title appears
- The description appears
- The created date/time is displayed

This is handled in `createBookmarkElement()`.

# Each bookmark’s title is a link to the bookmark’s URL

We clicked bookmark titles and confirmed they open the correct URL in a new browser tab.

# Each bookmark's "Copy to clipboard" button must copy the URL

We clicked the **Copy URL** button and pasted into a text editor to confirm the correct link was copied. The function `copyToClipboard(url)` handles this.

# Each bookmark's like counter works independently, and persists data across sessions

We clicked the ❤️ button several times and confirmed:

- The number increases correctly
- Refreshing the page keeps the updated like count

This is handled by `toggleLike()` and `setData()`.

# The website must contain a form with inputs for a URL, a title, and a description

We checked the form contains:

- URL input
- Title input
- Description input
- Submit button

We also tested submitting the form using the keyboard (Enter key).

# Submitting the form adds a new bookmark for the relevant user only

We selected a user and added a bookmark. Then we switched to another user and confirmed the bookmark does not appear there.

# After creating a new bookmark, the list of bookmarks for the current user is shown

After submitting the form, we confirmed the new bookmark immediately appears without refreshing the page.

# The website must score 100 for accessibility in Lighthouse

We ran Lighthouse in Chrome DevTools and confirmed the Accessibility score is 100 in all views, users with bookmarks and without bookmarks.

# Unit tests must be written for at least one non-trivial function

Unit tests are located in **example.test.js**.

These tests verify:

- Adding bookmarks stores data correctly
- URL validation logic
- Bookmark likes start at 0
- Non-trivial test: bookmarks are created with timestamps to ensure reverse chronological sorting works. This ensures bookmarks display in the correct order for users.
