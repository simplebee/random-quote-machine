//Use jsonp, due to same origin policy
function getRandomQuote() {
  $.ajax({
    method: "GET",
    url: "http://api.forismatic.com/api/1.0/",
    data: {
      "method": "getQuote",
      "format": "jsonp",
      "lang": "en",
      "jsonp": "callback"
    },
    dataType: "jsonp",
    jsonpCallback: "callback"
  })
  .done(setQuote)
  .fail(function() {
    console.log("Ajax request: Fail");
  });
}

//json.quoteAuthor sometimes has an empty string
function replaceEmptyStr(str) {
  if (str) {
    return str;
  } else {
    return "Unknown";
  }
}

//138 characters for quote + author only (allow space for " -")
function underTweetLength(quote, author) {
  if(quote.length + author.length <= 138) {
    return true;
  } else {
    return false;
  }
}

//Creates twitter link w/ query string
function createTwitterLink(quote, author) {
  var obj = {text: quote + " -" + author};
  var queryStr = $.param(obj);
  var link = "https://twitter.com/intent/tweet?" + queryStr;
  return link;
}

//Sets quote text + author text + twitter link
function setQuote(json) {
  //Remove extra spaces
  var quote = $.trim(json.quoteText);
  var author = $.trim(replaceEmptyStr(json.quoteAuthor));

  //Only use quotes that can fit in a tweet
  if (underTweetLength(quote, author)) {
    console.log("Ajax request: Success");

    var link = createTwitterLink(quote, author);
    $("#quote").html(quote);
    $("#author").html("- " + author);
    $("a").attr("href", link);
  } else {
    console.log("Ajax request: Over 140 Characters");
    getRandomQuote();
  }
}

$(document).ready(function() {
  getRandomQuote();
  $("#btn-quote").on("click", getRandomQuote);
});