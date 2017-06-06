var YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/search';
var QUERY_HISTORY = null;
var NEXT_PAGE_TOKEN = null;
var PREV_PAGE_TOKEN = null;
var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<h2>' +
    '<img class="js-thumbnail"><br>' +
    '<a class="js-result-title" href="" target="_blank"></a><br><a class="js-channel" href="" target="_blank"></a></h2>' +
    '<p>Date added: <span class="js-date"></span></p>' +
    '<p><span class="js-description"></span></p>' + 
  '</div>'
);

function getDataFromApi(searchTerm, callback, page) {
  var query = {
  	part: 'snippet',
  	key: 'AIzaSyCVbxGQAdJlblEf29sm3bVsC6rF_DyuAx0',
    q: searchTerm,
    pageToken: page
  }
  QUERY_HISTORY = searchTerm;
  $.getJSON(YOUTUBE_URL, query, callback);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-result-title").text(result.snippet.title).attr("href", 'https://www.youtube.com/watch?v='+result.id.videoId+'');
  template.find(".js-channel").text(result.snippet.channelTitle).attr("href", 'https://www.youtube.com/channel/'+result.snippet.channelId+'');
  template.find(".js-description").text(result.snippet.description);
  template.find(".js-date").text(result.snippet.publishedAt);
  template.find(".js-thumbnail").attr("src", result.snippet.thumbnails.medium.url)
  								.unbind().click(function(){
  									$('#ytplayer').attr("src", 'https://www.youtube.com/embed/'+result.id.videoId+'?autoplay=1');
  								});
  return template;
}

function displayGitHubSearchData(data) {
	var results = data.items.map(function(item, index) {
		return renderResult(item);
	});
	$('.js-search-results').html(results);
	console.log('API RESPONSE: \n');
	console.dir(data);
	// store page tokens to be used with buttons
	NEXT_PAGE_TOKEN = data.nextPageToken;
	PREV_PAGE_TOKEN = data.prevPageToken;
	// if the tokens are stored, enable the buttons
	if(NEXT_PAGE_TOKEN){$('.js-nextpage').prop('disabled', false);}
	if(PREV_PAGE_TOKEN){$('.js-prevpage').prop('disabled', false);}
}

function watchButtons() {
	$('.js-search-form').submit(function(event) {
		event.preventDefault();
		var queryTarget = $(event.currentTarget).find('.js-query');
		var query = queryTarget.val();
		// clear out the input
		queryTarget.val("");
		getDataFromApi(query, displayGitHubSearchData);
	});
  	$('.js-nextpage').unbind().click(function(){
		console.log('[More Results]');
		getDataFromApi(QUERY_HISTORY, displayGitHubSearchData, NEXT_PAGE_TOKEN);
	});
 	$('.js-prevpage').unbind().click(function(){
		console.log('[Previous Results]');
		getDataFromApi(QUERY_HISTORY, displayGitHubSearchData, PREV_PAGE_TOKEN);
	});
}

$(watchButtons);