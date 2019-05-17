function newsFeeds() {
  var feeds = new Array;
  feeds[0] = escape("http://www.nu.nl/feeds/rss/algemeen.rss");
  feeds[1] = escape("https://www.telegraaf.nl/rss");
  feeds[2] = escape("https://www.volkskrant.nl/voorpagina/rss.xml");
  feeds[3] = escape("http://www.nrc.nl/rss/");
  
  var newFeedDivs = "";
  for (var i=0; i<feeds.length; i++) {
    newFeedDivs += "<div id='n" + i + "' class='news'></div>";
  }
  document.getElementById("feeds").innerHTML = newFeedDivs;

  var feedShowers = new Array;
  for (i=0;i<feeds.length;i++) {
    feedShowers[i] = new feedShower;
    feedShowers[i].start(feeds[i], i);
  }

  setInterval(function() {
    document.getElementById("updating").innerHTML = "<img src='updating.gif'>";
    setTimeout(function() {document.getElementById("updating").innerHTML = "";}, 1500);
    for (i=0;i<feeds.length;i++) {feedShowers[i].start(feeds[i], i);}
  }, 60000);

  document.getElementById("headingsOnly").onclick = function() {  
    for (i=0;i<feeds.length;i++) {feedShowers[i].start(feeds[i], i);}
  }

  function feedShower() {
    this.start = function(feed, n) {
      var feedRequest = new XMLHttpRequest();
      feedRequest.open("GET", "feedbouncer.php?feed=" + feed, true);
      feedRequest.onreadystatechange = processNewsFeed;
      feedRequest.send(null);

      function processNewsFeed() {
        if (feedRequest.readyState == 4 && feedRequest.status == 200) {
          var toptitle = feedRequest.responseXML.getElementsByTagName("title")[0].childNodes[0].nodeValue;
          var items = feedRequest.responseXML.getElementsByTagName("item");
          var stream = "<h4>" + toptitle + "</h4><hr>";
          try {
            for (var i=0;i<items.length;i++) {
              var title = items[i].getElementsByTagName("title")[0].childNodes[0].textContent;
              var description = items[i].getElementsByTagName("description")[0].textContent;
              if (description.indexOf("<img") > -1) {description = description.substr(0, description.indexOf("<img"));};
              var link = items[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
              var pubDateString = items[i].getElementsByTagName("pubDate")[0].textContent;
              pubDateString = new Date(pubDateString).toLocaleString();            
              var pubTime = pubDateString.substr(pubDateString.indexOf(":")-2, 5);
              stream += "<dl><dt style='float: left'><i>" + pubTime + "</i></dt><dd><a href='" + link + "' target='_blank'><b>" + title + "</b></a></dd></dl>";
              if (!document.getElementById("headingsOnly").checked) {
                stream += "<p>" + description + "</p><hr>";
              }
            }
          } catch(error) {
              stream += "<p style='color:red'>Error in RSS feed</p><hr>";
          }
          var id = "n" + n;
          document.getElementById(id).innerHTML = stream;
        }
      }
    }
  }
}