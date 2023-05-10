/*************
 *  Variables *
 *************/
let activePage = "home";
let activeInstanceUrl = "https://y.com.sb";
let searchBarActive = false;
let suggestionsMouseOver = false;
let videoPage = 0;

let popularApiUrl = "/api/v1/popular";

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
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "home";
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*the next button*/
  footer.style.display = "none";
  videoPage = 0;
  /*the nav*/
  homeImg.style.filter = "invert(60%)";
  subImg.style.filter = "none";
  sideBar.style.display = "none";
  flagImg.style.filter = "none";

  changeMain("home");
}

function displayPlaylistPage() {
  sideBar.innerText = "";
  /*changes main and activePage*/
  main.innerHTML = "";
  activePage = "playlist";
  /*the grid system*/
  main.style.justifyContent = "center";
  main.setAttribute("class", "fourGridColumn");
  /*The side bar is shown*/
  sideBar.style.display = "block";
  /*the next button*/
  footer.style.display = "none";
  videoPage = 0;


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
  videoPage = 0;

  sideBar.style.display = "block";
  sideBar.innerText = "";
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
  videoPage = 0;
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
      url = "/api/v1/popular?page=" + videoPage;
      break;
    case "subscriber":
      url = "/api/v1/popular?page=" + videoPage;
      break;
    case "search":
      main.innerHTML += `
        <h1>Page: ${videoPage + 1}</h1>
      `;
      url =
        "/api/v1/search/?q=" +
        makeUserTextGood() +
        "?sort_by=relevance" +
        "?page=" +
        videoPage;
      break;
  }
  getApiData(url);
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

function searchBarSearch(pre = "relevance") {
  console.log(pre);
  makeSearchthingBox();
  changeMain("search");
}

/**************
 *  Api Calls *
 *************/
function getApiData(url) {
  console.log("Page: " + videoPage);
  console.log("url: " + activeInstanceUrl + url);
  footer.innerHTML = `
    <button onclick="pageChange('left')" id="lastPageButton">Last Page</button>
    <button onclick="pageChange('right')" id="nextPageButton">Next Page</button>
  `;

  fetch(activeInstanceUrl + url)
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
                        <p>${data[i].author}</p>
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
                        <p>${data[i].author}</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
            break;
        }
      }
    });
}

function searchPromptSuggestions() {
  if (document.getElementById("searchBar").value == "") {
    searchSuggestions.innerHTML = "";
  }
  fetch(
    activeInstanceUrl +
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
        videoPage = 0;
      }
      break;
    case "left":
      if (videoPage > -1) {
        videoPage--;
        changeMain(activePage);
      } else {
        videoPage = 0;
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
    activeInstanceUrl +
      "/api/v1/channels/search/"+
      document.getElementById("searchBar").value
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      searchSuggestions.innerHTML = "";
      for (let i = 0; i < data.suggestions.length; i++) {
        sideBar.innerHTML += `
          <p>g</p>
        `;
      }
    });
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

function calculateTime(time_s) {
  var minute = Math.floor(time_s / 60);
  var rest_seconds = time_s % 60;
  return minute + "min " + rest_seconds + "s";
}
/****************
 *  WindowLoad *
 ****************/
window.onload = function () {
  sessionStorage.setItem("activeInstanceUrl", activeInstanceUrl);
  displayHomePage();
};
/***********
 *  Playlist *
 **********/
function newPlaylist() {}
/*********
 *  Other *
 *********/