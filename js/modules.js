function getActiveInstance() {
    return "https://invidious.lunar.icu";
    //TODO:something isnt working
}

function calculateTime(time_s, _type) {
  var minute = Math.floor(time_s / 60);
  var rest_seconds = time_s % 60;
  if(_type == "minimal"){
    return minute + ":" + rest_seconds;
  }
  return minute + "min " + rest_seconds + "s";
}

/********* open Video *********/
function openVideo(videoId) {

  (async() => {
    let currentUrl = window.location.href;
    let urlToUse = "";
    let urlREALLYtoUse = "";

    for(let i = 0; i < currentUrl.length; i++) {
      if(currentUrl.charAt(i) == "/") {
        urlToUse += currentUrl.charAt(i);
        switch(currentUrl.charAt(i+1)) {
          case 'm': //HACK: the "m" from main but if the url also has an m it doesn't work.
            urlREALLYtoUse = urlToUse
        }
      }
      else {
        urlToUse += currentUrl.charAt(i);
      }
    }
    
    urlREALLYtoUse += 'video.html?id=' + videoId;
    console.log(urlREALLYtoUse)
    window.open(urlREALLYtoUse);
  })()
}
/**************
* creatorPage * 
**************/
function creatorPage(url) {
  console.log("Urltogoto: ", url);
  (async() => {
    let currentUrl = window.location.href;
    let urlToUse = "";
    let urlREALLYtoUse = "";

    let numberOfSlash = 0;
    const NUMBER_OF_SLASH_TO_GO_TO = 4
    for(let i = 0; i < currentUrl.length; i++) {
      if (numberOfSlash>NUMBER_OF_SLASH_TO_GO_TO) {
      //HACK: i don't know but this has to be this way otherwise it doesn't do pages and i don't want to fix it :)
      }
      else {
        if(currentUrl.charAt(i) == "/") {
          numberOfSlash++
          urlToUse += currentUrl.charAt(i);
        }
        else {
          urlToUse += currentUrl.charAt(i);
        }
      }

    }
    
    //No chanals//
    let cleanChanalUrl = "";
    let slashFound = 0; //happens when there is an / found
    for(let i = 0; i < url.length;i++) {
      if (url.charAt(i) == "/"){
        slashFound++;
        console.log("/Found: ",slashFound)
      }
      //after//
      if(slashFound>=2) { //HACK: 2 for local hosting 3 for github
        console.log(cleanChanalUrl)
        cleanChanalUrl += url.charAt(i);
      }
    }

    urlREALLYtoUse += urlToUse + "channels.html?id=" + cleanChanalUrl;
    console.log(urlREALLYtoUse)
    window.open(urlREALLYtoUse);
  })()
}