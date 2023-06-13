/*************
 *  Variables *
 *************/
let activePage = "home";
let searchBarActive = false;
let suggestionsMouseOver = false;
let videoPage = 1;
let activeInstance;

/**************
 *  Keydowns *
 *************/
document.onkeyup = keyup_detected;

function keyup_detected(e) {
  if (!e) {
    e = window.event; //Internet Explorer
  }
  if (e.keyCode == 13 && searchBarActive == true) {
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
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;
  /*the nav*/
  homeImg.style.filter = "invert(60%)";
  subImg.style.filter = "none";
  flagImg.style.filter = "none";

  changeMain("home");
}

function displayPlaylistPage() {
  sideBar.innerText = "";
  sideBar.style.display = "block";
  displayPlaylists();
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "playlist";
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;
  
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "none";
  flagImg.style.filter = "invert(60%)";

  changeMain("playlist");
}

function displaySubscriptionPage() {
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "subscriber";
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*the next button*/
  footer.style.display = "none";
  videoPage = 1;

  sideBar.innerText = "";
  sideBar.style.display = "block";
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "invert(60%)";
  flagImg.style.filter = "none";

  changeMain("subscriber");
}

function makeSearchthingBox() {
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "search";
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*the next button*/
  footer.style.display = "flex";
  videoPage = 1;
  /*The side bar is shown*/
  sideBar.style.display = "block";
  sideBar.innerText = "";
  /*the nav*/
  homeImg.style.filter = "none";
  subImg.style.filter = "none";
  flagImg.style.filter = "none";
  main.innerHTML = `
        <div id="sortBox">
            <button onclick="searchBarSearch('relevance')">Relevance</button>
            <button onclick="searchBarSearch('rating')">Rating</button>
            <button onclick="searchBarSearch('upload_date')">Upload Date</button>
            <button onclick="searchBarSearch('view_count')">View Count</button>
        </div>
    `;
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
      url = "/api/v1/popular?page=" + videoPage;
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
function mouseOverSearch() {
  searchBarActive = true;
  searchSuggestions.style.display = "block";
}

function mouseOutSearch() {
  searchBarActive = false;
  setTimeout(function () {
    if (suggestionsMouseOver == false) {
      searchSuggestions.style.display = "none";
    }
  }, 300);
}

function searchSuggestionsOnMouseOverFunc() {
  suggestionsMouseOver = true;
  console.log(suggestionsMouseOver);
}

function searchSuggestionsOnMouseLeave() {
  suggestionsMouseOver = false;
  searchSuggestions.style.display = "none";
}

function searchBarSearch() {
  makeSearchthingBox();
  changeMain("search");
}

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

      //Does the other things
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        switch (data[i].type) {
          case "video":
            main.innerHTML += `
              <div id="vid-box" onclick="openVideo('${data[i].videoId}')" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
                <div id="touchBoxforHover">
                    
                  <div id="vid-box-footer-box">
                      
                    <div id="vid-box-footer">
                        <p id="vidTitle">${data[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                    </div>

                    <div id="vid-box-footer" style="bottom:0px;position:absolute  ;">
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
            main.innerHTML += `
              <div id="playlist-box" onclick="" style="background-image: url(${data[i].playlistThumbnail});">
                
                <div id="touchBoxforHover">
                            
                  <div id="vid-box-footer">
                      <p id="vidTitle">${data[i].title}</p>
                    <hr>
                      <p>${abbreviateNumber(data[i].videoCount)} Videos</p>
                  </div>
                  
                </div>

              </div>
            `;
            break;
          case "shortVideo":
            // TODO: author page
            main.innerHTML += `
              <div id="vid-box" onclick="openVideo('${data[i].videoId}')" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
                <div id="touchBoxforHover">

                  <div id="vid-box-footer-box">
                  
                    <div id="vid-box-footer">
                        <p id="vidTitle">${data[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                    </div>

                    <div id="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
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
            main.innerHTML += `
            <div id="vid-box"  class="scheduledVideo" style="background-image: url(${data[i].videoThumbnails[4].url});">
                
            <div id="touchBoxforHover">

              <div id="vid-box-footer-box">
              
                <div id="vid-box-footer">
                    <p id="vidTitle">${data[i].title}</p>
                  <hr>
                    <p>${abbreviateNumber(data[i].viewCount)} Views</p>
                </div>

                <div id="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
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
    });
}

function searchPromptSuggestions() {
  if (document.getElementById("searchBar").value == "") {
    searchSuggestions.innerHTML = "";
  }
  fetch(
    activeInstance +
      "/api/v1/search/suggestions?q=" +
      document.getElementById("searchBar").value +
      "page="
  )
    .then((response) => response.json())
    .then((data) => {
      searchSuggestions.innerHTML = "";
      for (let i = 0; i < data.suggestions.length; i++) {
        searchSuggestions.innerHTML += `
          <p onclick="getApiData('/api/v1/search/?q='+ '${data.suggestions[i]}'), makeSearchthingBox()" class="searchSuggestionMessage">${data.suggestions[i]}</p>
        `;
      }
    });
}

function pageChange(direction) {
  main.innerHTML = "";
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

      for (let i = 0; i < data.length; i++) {
        if(data[i].type == "channel"){
          
        }
        sideBar.innerHTML += `

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
    });
}

 async function displayPlaylists() {
  sideBar.innerHTML = "";
  let json = JSON.parse(localStorage["Viider"]);
  if(json.list.length == 0 || json == undefined){
    sideBar.innerHTML = `
      no playlists found
    `
  }
  for(let i = 0;i<json.list.length;i++){
    sideBar.innerHTML += `
        <p class="playlists" id="playlistNr${i}" onclick="displayPlaylistVideo('${json.list[i].name}', ${i})">${json.list[i].name} 
          <button onclick="deletePlaylist(${i})">X</button>
        </p>
    `
  }

}

function displayPlaylistVideo(name, nr){
  displayPlaylists()
  //makes the button clicked
  document.getElementById("playlistNr"+nr).style.backgroundColor = "#1b10106a";

  //the other thing
  main.innerHTML = "";
  let json = JSON.parse(localStorage["Viider"]);


  for(let i = 0;i<json.list.length;i++){
    if(json.list[i].name == name){

      for(let j = 0;j<json.list[i].ids.length;j++){
        fetch(activeInstance + "/api/v1/videos/" + json.list[i].ids[j])
        .then((response) => response.json())
        .then((data) => {
          main.innerHTML += `
            <div id="vid-box" onclick="openVideo('${data.videoId}')" style="background-image: url(${data.videoThumbnails[4].url});">
              
              <div id="touchBoxforHover">
                  
                <div id="vid-box-footer-box">
                    
                  <div id="vid-box-footer">
                      <p id="vidTitle">${data.title}</p>
                    <hr>
                      <p>${abbreviateNumber(data.viewCount)} Views</p>
                  </div>

                  <div id="vid-box-footer" style="bottom:0px;position:absolute  ;">
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
        });

      }

    }
  }
 
}
/************
 *  Converts *
 ************/
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
/*********
 *  Other *
 *********/
