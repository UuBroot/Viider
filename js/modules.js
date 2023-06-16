async function getActiveInstance() {
  try {
    const response = await fetch("https://api.invidious.io/instances.json?pretty=1&sort_by=type,users");
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    const activeInstance = data.find(instance => instance[1].api);
    return new Promise((resolve, reject) => {
      // Fetch data and resolve the promise with the fetched data
      resolve(activeInstance ? activeInstance[1].uri : null);
    });
  } catch (error) {
    console.error(`Could not get active instance: ${error}`);
    return null;
  }
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

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

function makeUserTextGood() {
  let badText = document.getElementById("searchBar").value;
  let goodText = "";
  for (let i = 0; i < badText.length; i++) {
    if (badText.charAt(i) == " ") {
      goodText += "+";
    } else {
      goodText += badText.charAt(i);
    }
  }
  return goodText;
}
/********* open Video *********/
function openVideo(videoId, short = false) {

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
    if(short){
      urlREALLYtoUse += 'short.html?id=' + videoId;
    }
    else {
      urlREALLYtoUse += 'video.html?id=' + videoId;
    }

    console.log(urlREALLYtoUse)
    window.location.replace(urlREALLYtoUse);
  })()
}
function openHome(){
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
  
  urlREALLYtoUse += 'main.html';
  console.log(urlREALLYtoUse)
  window.location.replace(urlREALLYtoUse);
}
/**************
* creatorPage * 
**************/
function creatorPage(url) {
  console.log("Urltogoto: ", url);
  window.replace('./channels.html')
  /*
  (async() => {
    let currentUrl = window.location.href;
    let urlToUse = "";
    let urlREALLYtoUse = "";

    let numberOfSlash = 0;
    const NUMBER_OF_SLASH_TO_GO_TO = 4 //4 is default
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
  })()*/
}

/**Local Storrage**/

function checkLocalStorrage(){
  if(localStorage["Viider"]== undefined) {

    localStorage["Viider"] = JSON.stringify(
      {
        list:[

        ],
        subChan:[

        ]
      }

    )
  }
}

/*  Playlists  */

async function writeVideoToLocalStorage(name, videoid) {
  await checkLocalStorrage();

  let json = JSON.parse(localStorage["Viider"]);
  let found = false;

  for(let i = 0;i<json.list.length;i++){

    if(json.list[i].name == name){
      console.log("playlist allready exists")
      found = true
      json.list[i].ids.push(videoid)
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

  localStorage["Viider"] = JSON.stringify(json)
  console.log("written")
  console.log(JSON.stringify(localStorage.getItem("Viider")))

}

function readVideoFromLocalStorage() {
  let json = JSON.parse(localStorage["Viider"]);
  console.log(json)

  for(let i = 0;i<json.list.length;i++){
    console.log(json.list[i].name)
  }
}

function downloadPlaylistFile(){
  const link = document.createElement("a");
  const file = new Blob([JSON.stringify(JSON.stringify(localStorage["Viider"]) , null, 2)], {
    type: "application/json",
  });
  link.href = URL.createObjectURL(file);
  link.download = "Viider-Backup-"+Date+".json";
}

function deletePlaylist(nr){
  let json = JSON.parse(localStorage["Viider"]);
  
  json.list.splice(nr, 1);

  localStorage["Viider"] = JSON.stringify(json);
}
/**************
 * Subscriber *
 *************/
async function writeChanel(chanalId , name) {
  await checkLocalStorrage();

  let json = JSON.parse(localStorage["Viider"]);
  let found = false;

  for(let i = 0;i<json.subChan.length;i++){
    if(json.subChan[i].chanalId == chanalId){
      found = true;

      //TODO:Remove Chanel
      alert("already subscribed")
    }
  }

  if(!found){
    json.subChan.push(
      {
        name: name,
        chanalId: chanalId
      }
    )
  }
  localStorage["Viider"] = JSON.stringify(json);
}

function deleteChanalFromStorrage(nr){
  let json = JSON.parse(localStorage["Viider"]);

  json.subChan.splice(nr, 1);

  localStorage["Viider"] = JSON.stringify(json);
}