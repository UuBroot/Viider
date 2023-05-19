function getActiveInstance() {
    return "https://invidious.lunar.icu";
    //TODO:something isnt working
}
function calculateTime(time_s) {
  var minute = Math.floor(time_s / 60);
  var rest_seconds = time_s % 60;
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