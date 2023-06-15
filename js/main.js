/*************
 *  Variables *
 *************/
let activePage = "home";
let videoPage = 1;
let activeInstance;
let searchBarActive = false;

/**************
 *  Keydowns *
 *************/
document.onkeyup = keyup_detected;

function keyup_detected(e) {
  if (!e) {
    e = window.event; //Internet Explorer
  }
  if (e.keyCode == 13 && searchBarActive) {
    // ENTER
    searchBarSearch();
  }
}
/**************
 *  Documents *
 **************/
let homeImg = document.getElementById("homeImg");
let flagImg = document.getElementById("flagImg");
let subImg = document.getElementById("subImg");
let main = document.getElementById("main");
let sideBar = document.getElementById("sideBar");
let searchSuggestions = document.getElementById("searchSuggestions");
let searchInput = document.getElementById("searchBar");
let footer = document.getElementById("footer");

/*****************
 *  Change Color *
 *****************/

/**********
 *  Scenes *
 **********/
function displayHomePage() {
  sideBar.innerText = "";
  sideBar.style.display = "none";
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "home";
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;
  sideBar.style.height = "300px";
  /*the nav*/
  homeImg.style.filter = "invert(60%)";
  subImg.style.filter = "none";
  flagImg.style.filter = "none";

  changeMain("home");
}

function displayPlaylistPage() {
  sideBar.innerText = "";
  sideBar.style.display = "block";
  main.innerHTML = "";
  /*changes main and activePage*/
  activePage = "playlist";
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;
  sideBar.style.height = "300px";
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "none";
  flagImg.style.filter = "invert(60%)";

  displayPlaylists();
}

function displaySubscriptionPage() {
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "subscriber";
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;

  sideBar.style.height = "400px";
  sideBar.innerText = "";
  sideBar.style.display = "block";
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "invert(60%)";
  flagImg.style.filter = "none";

  printSubscribedVideos();
}

function makeSearchthingBox() {
  /*changes main and activePage*/
  activePage = "search";
  main.innerHTML = "";
  /*the next button*/
  footer.style.display = "flex";
  videoPage = 1;
  /*The side bar is shown*/
  sideBar.style.display = "block";
  sideBar.innerText = "";
  sideBar.style.height = "300px";
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "none";
  flagImg.style.filter = "none";
  displayChanalsInSearch();
}

function changeMain(par) {
  AOS.refresh();
  //Does the animation
  AOS.init({
    duration: 2000,
  })
  
  let url;
  switch (par) {
    case "home":
      url = "/api/v1/popular?page=" + videoPage;
      break;
    case "playlist":
      url = null;
      break;
    case "subscriber":
      url = null;
      break;
    case "search":
      main.innerHTML += `
        <h1>Page: ${videoPage}</h1>
      `;

      url =
        "/api/v1/search/?q=" +
        makeUserTextGood() +
        "&sort_by=" + 
        document.getElementById("sortType").value +
        "&page=" +
        videoPage;

      break;
  }

  try{
    getApiData(url);
  }
  catch{
    console.log("did not load the videos")
  }

}

function openSettings() {
  window.location = "../pages/settings.html"
}
/**************
 *  Search Bar *
 **************/

function searchBarSearch() {
  makeSearchthingBox();
  changeMain("search");
}

searchInput.addEventListener("focus", function (){

  searchSuggestions.style.display = "block";

  searchBarActive = true;

});

searchInput.addEventListener("focusout", function (){

  searchSuggestions.style.display = "none";

  searchBarActive = false;
  
});
/**************
 *  Api Calls *
 *************/
function getApiData(url) {
  console.log("Page: " + videoPage);
  console.log("url: " + activeInstance + url);
  footer.innerHTML = `
    <button onclick="pageChange('left')" id="lastPageButton" class="pageButton"><</button>
    <button onclick="pageChange('right')" id="nextPageButton" class="pageButton">></button>
  `;

  fetch(activeInstance + url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let string = "";
      if(data.length == 0) {
        string = "No Videos Found"
      }
      for (let i = 0; i < data.length; i++) {
        switch (data[i].type) {
          case "video":
            string += `
              <div class="vid-box" onclick="openVideo('${data[i].videoId}')" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
                <div class="touchBoxforHover">
                    
                  <div class="vid-box-footer-box">
                      
                    <div class="vid-box-footer">
                        <p id="vidTitle">${data[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                    </div>

                    <div class="vid-box-footer" style="bottom:0px;position:absolute  ;">
                        <p>${data[i].publishedText}</p>
                      <hr>
                        <p>${calculateTime(data[i].lengthSeconds)}</p>
                      <hr>
                        <p onclick="creatorPage('${data[i].authorUrl}')" class="authorNamePageButton">${data[i].author}</p>
                    </div>
                    
                  </div>
                
                </div>
            
              </div>
            `;
            break;
          case "playlist":
            string += `
              <div class="playlist-box" onclick="" style="background-image: url(${data[i].playlistThumbnail});">
                
                <div class="touchBoxforHover">
                            
                  <div class="vid-box-footer">
                      <p id="vidTitle">${data[i].title}</p>
                    <hr>
                      <p>${abbreviateNumber(data[i].videoCount)} Videos</p>
                  </div>
                  
                </div>

              </div>
            `;
            break;
          case "shortVideo":
            string += `
              <div class="vid-box" onclick="openVideo('${data[i].videoId}')" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
                <div class="touchBoxforHover">

                  <div class="vid-box-footer-box">
                  
                    <div class="vid-box-footer">
                        <p id="vidTitle">${data[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                    </div>

                    <div class="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
                        <p>${data[i].publishedText}</p>
                      <hr>
                        <p>${calculateTime(data[i].lengthSeconds)}</p>
                      <hr>
                        <p onclick="creatorPage('${data[i].authorUrl}')" class="authorNamePageButton">${data[i].author}</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
            break;
          case "scheduled":
            string += `
            <div class="vid-box"  class="scheduledVideo" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
            <div class="touchBoxforHover">

              <div class="vid-box-footer-box">
              
                <div class="vid-box-footer">
                    <p id="vidTitle">${data[i].title}</p>
                  <hr>
                    <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                </div>

                <div class="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
                    <p>${data[i].publishedText}</p>
                  <hr>
                    <p>${calculateTime(data[i].lengthSeconds)}</p>
                  <hr>
                    <p onclick="creatorPage('${data[i].authorUrl}')" class="authorNamePageButton">${data[i].author}</p>
                </div>
              </div>
            </div>
          </div>
            `
            
        }

      }
      main.innerHTML = string;
    });
}

function searchPromptSuggestions() {
  if (document.getElementById("searchBar").value == "") {
    searchSuggestions.innerHTML = "";
  }

  fetch(
    activeInstance +
      "/api/v1/search/suggestions?q=" +
      document.getElementById("searchBar").value
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      let string = "";
      for (let i = 0; i < data.suggestions.length; i++) {
        string += `
          <p onclick="getApiData('/api/v1/search/?q='+ '${data.suggestions[i]}'), makeSearchthingBox()" class="searchSuggestionMessage">${data.suggestions[i]}</p>
        `;
      }
      searchSuggestions.innerHTML = string;
    });
}

function pageChange(direction) {
  switch (direction) {
    case "right":
      if (videoPage > -1) {
        videoPage++;
        changeMain(activePage);
      } else {
        videoPage = 1;
      }
      break;
    case "left":
      if (videoPage > -1) {
        videoPage--;
        changeMain(activePage);
      } else {
        videoPage = 1;
      }
      break;
    default:
  }
}

function displayChanalsInSearch() {
  if (document.getElementById("searchBar").value == "") {
    searchSuggestions.innerHTML = "";
  }

  fetch(
    activeInstance +
      "/api/v1/search/?q="+
      document.getElementById("searchBar").value+
      "&type=channel"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("---------------channel---------------")
      console.log(data)
      searchSuggestions.innerHTML = "";

      let string = "";
      if(data.length == 0) {
        string = "No Channels Found"
      }
      for (let i = 0; i < data.length; i++) {
        if(data[i].type == "channel"){

          string += `

            <div class="channelBox" onclick="creatorPage('${data[i].authorUrl}')">

              <img src="${data[i].authorThumbnails[0].url}">

              <div>
              
                <p class="authorName">${data[i].author}</p>

                <p>${data[i].descriptionHtml}</p>

              </div>

              <p class="subscriberBox">${abbreviateNumber(data[i].subCount)} Subscriber</p> 
            
            </div>
          
          `;
        }
       
      }
      sideBar.innerHTML = string;
    });
}

 async function displayPlaylists() {
  sideBar.innerHTML = "";
  let json = JSON.parse(localStorage["Viider"]);
  if(json.list.length == 0){
    sideBar.innerHTML = `
      no playlists found
    `
  }
  else {
    let string = "";

    for(let i = 0;i<json.list.length;i++){
      string += `
          <p class="playlists" id="playlistNr${i}" onclick="displayPlaylistVideo('${json.list[i].name}', ${i})">${json.list[i].name} 
            <button onclick="deletePlaylist(${i})" class="deletePlaylistButton">X</button>
          </p>
      `
    }

    sideBar.innerHTML = string;

  }

}

function displayPlaylistVideo(name, nr){
  displayPlaylists()
  //makes the button clicked
  document.getElementById("playlistNr"+nr).style.backgroundColor = "#1b10106a";

  //the other thing
  let json = JSON.parse(localStorage["Viider"]);


  for(let i = 0;i<json.list.length;i++){
    if(json.list[i].name == name){

      for(let j = 0;j<json.list[i].ids.length;j++){
        fetch(activeInstance + "/api/v1/videos/" + json.list[i].ids[j])
        .then((response) => response.json())
        .then((data) => {
          let string = "";
          string += `
            <div class="vid-box" onclick="openVideo('${data.videoId}')" style="background-image: url(${data.videoThumbnails[4].url});">
              
              <div class="touchBoxforHover">
                  
                <div class="vid-box-footer-box">
                    
                  <div class="vid-box-footer">
                      <p id="vidTitle">${data.title}</p>
                    <hr>
                      <p>${abbreviateNumber(data.viewCount)} Views</p>
                  </div>

                  <div class="vid-box-footer" style="bottom:0px;position:absolute  ;">
                      <p>${data.publishedText}</p>
                    <hr>
                      <p>${calculateTime(data.lengthSeconds)}</p>
                    <hr>
                      <p onclick="creatorPage('${data.authorUrl}')" class="authorNamePageButton">${data.author}</p>
                  </div>
                  
                </div>
              
              </div>
          
            </div>
          `;
          main.innerHTML = string;
        });

      }

    }
  }
 
}

function displayChanalName(name, chanalId, subCount, profilePic){
  sideBar.innerHTML += `
    <div style="display:flex;align-items:center">

      <div onclick="creatorPage('//${chanalId}')" class="creatorButton">

        <p>${name}</p>
        
        <p>${abbreviateNumber(subCount)} Subscriber</p>

        <img src="${profilePic}" class="profilePicFromSubscribed">

      </div>
      <button onclick="deleteChanal('${chanalId}')" class="unsubscribeButton">X</button>
    
    </div>
  `
}

function deleteChanal(chanalId){
  let json = JSON.parse(localStorage["Viider"]); 

  for (let i = 0;i<json.subChan.length;i++){
    if(json.subChan[i].chanalId == chanalId){
      deleteChanalFromStorrage(i);
      setTimeout(function(){
        displaySubscriptionPage();
      },400)
    }
    
  }
 
}

function sortAndDoSubscribedChannels(){
  let json = JSON.parse(localStorage["Viider"]);
  let videoArray = [];

  if(json.subChan.length == 0){
    sideBar.innerHTML = "You havn't subscribed to anyone yet."
  }

  for(let i = 0;i<json.subChan.length;i++){

    fetch(activeInstance+"/api/v1/channels/"+json.subChan[i].chanalId)
    .then (response => response.json ())
    .then((data) => {

      displayChanalName(data.author, data.authorId, data.subCount, data.authorThumbnails[4].url);//is for printing the chanal to the selection

      for(let i = 0;i<data.latestVideos.length;i++){
        videoArray.push(data.latestVideos[i]);
      }

    })

  }

  videoArray.sort((a, b) => {
    const timeA = a.published;
    const timeB = b.published;
    return timeA - timeB;
  });

  return videoArray;
}

function printSubscribedVideos(){

  let videoArray = sortAndDoSubscribedChannels();
  setTimeout(function(){
  
    let string = "";

    string += "Latest videos:"

    for(let i = 0;i<videoArray.length;i++){

      string += `
      <div class="vid-box" onclick="openVideo('${videoArray[i].videoId}')" style="background-image: url(${videoArray[i].videoThumbnails[4].url});">
          
      <div class="touchBoxforHover">
          
        <div class="vid-box-footer-box">
            
          <div class="vid-box-footer">
              <p class="vidTitle">${videoArray[i].title}</p>
            <hr>
              <p>${abbreviateNumber(videoArray[i].viewCount)} Views</p>
          </div>
  
          <div class="vid-box-footer" style="bottom:0px;position:absolute  ;">
              <p>${videoArray[i].publishedText}</p>
            <hr>
              <p>${calculateTime(videoArray[i].lengthSeconds)}</p>
            <hr>
              <p onclick="creatorPage('${videoArray[i].authorUrl}')" class="authorNamePageButton">${videoArray[i].author}</p>
          </div>
          
        </div>
      
      </div>
  
    </div>
      `;
    }
    main.innerHTML = string;
  },2000)

  
}

/****************
 *  WindowLoad *
 ****************/
window.onload = function () {
  asyncWindowLoad();
};

async function asyncWindowLoad(){
  activeInstance = await getActiveInstance();

  console.log("active instalce: ",activeInstance)
  displayHomePage();
}