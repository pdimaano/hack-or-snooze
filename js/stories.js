"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="bi bi-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();


  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Collects data from new story form, calls the addStory method
 *  and places new story on homepage.
*/

async function submitNewStory(evt) {
  // Get data from new story form
  // Calls the addStory method
  // Place new story on page
  evt.preventDefault();
  let title = $("#story-title").val();
  let author = $("#story-author").val();
  let url = $("#story-url").val(); //MUST BE ACTUAL URL TO WORK

  let storyObject = { "title": title, "author": author, "url": url };

  let story = await storyList.addStory(currentUser, storyObject);

  // prepend response (a Story) to the storyList
  let $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $newStoryForm.hide();
}

$("#new-story").on("submit", submitNewStory);

$allStoriesList.on("click", ".bi", toggleFavorite);

function toggleFavorite(evt){
  // debugger;
  let checked = $(evt.target).attr("bi-star-fill") !== undefined ? true : false;
  //if class is present, remove and removed from favorites
  $(evt.target).toggleClass("bi-star-fill bi-star");

  //if class is present, remove, and add story to favorites
  let storyId = $(evt.target).closest("li").attr("id");
  currentUser.checkIfFavorite(storyId, checked);
  // console.log(storyId);

}
