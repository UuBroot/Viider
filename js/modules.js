function getActiveInstance() {
    //return "https://invidious.lunar.icu";
    return "https://inv.tux.pizza";
    //TODO:something isnt working
}

function calculateTime(time_s, _type) {
  var minute = Math.floor((time_s / 60)%60);
  var rest_seconds = time_s % 60;
  var hour = Math.floor((time_s/60)/60);

  if(hour == 0){
    if(_type == "minimal"){
      return minute + ":" + rest_seconds;
    }
    else{
      return minute + "min " + rest_seconds + "s";
    }
  }
  else {
    if(_type == "minimal"){
      return hour + ":" + minute + ":" + rest_seconds;
    }
    else{
      return hour + "h " + minute + "min " + rest_seconds + "s";
    }
  }


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

/**Local Storrage**/

/*  Playlists  */

async function writeVideoToLocalStorage(name, videoid) {

  if(localStorage.getItem("playlists") == undefined) {
    console.log("creating new playlists")

    localStorage["playlists"] = JSON.stringify(
      {
        list:[
          {
            "name": name,
            "ids":[
              videoid
            ]

          }
        ]
      }

    )
    
  }
  else {
    let json = JSON.parse(localStorage["playlists"]);
    let found = false

    for(let i = 0;i<json.list.length;i++){
      if(json.list[i].name == name){
        console.log("playlist allready exists")
        found = true

        //Checks if the id already exists
        let alreadyExists = false;
        for(let j = 0;i<json.list[i].ids[j].length;j++){
          if (json.list[i].ids[j] == videoid){
            alreadyExists = true;
            alert("video already exists")
          }
        }
        if(!alreadyExists){
          console.log("put in video")
          json.list[i].ids.push(videoid)
        }

      }
    }
    if(!found){
      json.list.push(
        {
          "name": name,
          "ids":[
            videoid
          ]

        }
      )
    }


    localStorage["playlists"] = JSON.stringify(json)

  }

  console.log("written")
  console.log(JSON.stringify(localStorage.getItem("playlists")))
  
}

function readVideoFromLocalStorage() {
  let json = JSON.parse(localStorage["playlists"]);
  console.log(json)

  for(let i = 0;i<json.list.length;i++){
    console.log(json.list[i].name)
  }
}