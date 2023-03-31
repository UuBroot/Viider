let video = document.getElementById("videoSrc");
let videoIsLoaded = false;
let readyStateChecker;

window.onload = function () {
  let videoId = sessionStorage.getItem("videoId");
  getApiData(videoId);
  readyStateChecker = setInterval(function () {
    console.log(video.readyState);
    if (video.readyState == 4) {
      onvideoLoad();
    }
  }, 1000);
};

function copyVideo(videoLink) {
  document.getElementById("shareButton").style.animation = "rotatePress 2s";
  setTimeout(function () {
    document.getElementById("shareButton").style.animation = "none";
  }, 2000);
  console.log("https://www.youtube.com/watch?v=" + videoLink);
  navigator.clipboard.writeText("https://www.youtube.com/watch?v=" + videoLink);
}

function getApiData(videoId) {
  let activeInstanceUrl = sessionStorage.getItem("activeInstanceUrl");
  console.log(activeInstanceUrl);

  fetch(activeInstanceUrl + "/api/v1/videos/" + videoId)
    .then((response) => response.json())
    .then((data) => {
      document.title = data.title;
      console.log(data);
      //PutUrlInVideo
      //document.getElementById("videoPlayer").contentDocument.getElementById("videoSrc").src = data.formatStreams[0].url;
      document.getElementById("videoSrc").src = data.formatStreams[1].url;

      //PutInPreview
      document.getElementById("videoSrc").poster = data.videoThumbnails[0].url;

      //PutInCaption
      // TODO: Captions
      //document.getElementById("videoPlayer").contentDocument.getElementById("videoSrc").document.getElementById('videoTrackCaption').src = data.captions[0].url;

      //Quality Settings
      for (let i = 0; i < data.formatStreams.length; i++) {
        if(data.formatStreams[i].container == "mp4"){
          document.getElementById("qualitysettings").innerHTML += `
            <button onclick="changeVideoTo('${data.formatStreams[i].url}')">${data.formatStreams[i].qualityLabel}</button>
          `;
        }
      }


      makeComments(videoId);

      document.getElementById("desHeader").innerHTML += `
               <div style="display: flex;justify-content: space-between;">
                   <h2>${data.title}</h2>
                   <div>
                     <p>${data.publishedText}</p>
                     <p>${abbreviateNumber(data.viewCount)} Views</p>
                   </div>
               </div>

               <div style="display: flex;justify-content: space-between;">
                 <div style="display:flex;align-items:center;">
                   <img src="${
                     data.authorThumbnails[2].url
                   }" alt="" style="width:40px;height40px;margin-right:1vw;">
                   <p>${data.author}</p>
                   <button style="width:70px;height:25px;padding:0px;margin-left:0.5vw;">Subscribe</button>
                 </div>
                 <button onclick="downloadVideo()">Download</button> 
                 <div style="display:flex;background-color:#382A38;width:15vw;justify-content:space-between;border-radius:10px;padding:10px;">
                   <p>${abbreviateNumber(data.likeCount)} Likes</p>
                   <p>${abbreviateNumber(data.dislikeCount)} Dislikes</p>
                   <img onclick="copyVideo('${
                     data.videoId
                   }')" src="/img/share.svg" alt="Share" id="shareButton"></img>
                 </div>

                 </div>
                  <hr>
                 <div>
                   <p>${formateDescription(data.description)}</p>
                 </div>

                 <div id="commands">

                 </div>
               `;
      //Recomendet Videos
      document.getElementById("rightVidScreen").innerHTML = ``;
      for (let i = 0; i < data.recommendedVideos.length; i++) {
        //recVidBox
        document.getElementById("rightVidScreen").innerHTML += `
                   <div id="vid-box" onclick="openVideo('${
                     data.recommendedVideos[i].videoId
                   }')" style="background-image: url(${
          data.recommendedVideos[i].videoThumbnails[3].url
        });">
                   <div id="touchBoxforHover">
                       <div id="vid-box-footer">
                           <p id="vidTitle">${
                             data.recommendedVideos[i].title
                           }</p>
                           <p>${abbreviateNumber(
                             data.recommendedVideos[i].viewCount
                           )} Views</p>
                       </div>
                   </div>
               </div>
                   `;
      }
    });
}

function downloadVideo() {
  window.open(video.src);
}

function makeComments(id) {
  let activeInstanceUrl = sessionStorage.getItem("activeInstanceUrl");
  fetch(activeInstanceUrl + "/api/v1/comments/" + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.commentCount; i++) {
        document.getElementById("commands").innerHTML += `
                  <div id="comment">
                      <h3 id="commentername">${data.comments[i].author}</h3>
                      <p>${data.comments[i].content}</p>
                  </div>
                 `;
      }
    });
}

function changeVideoTo(url) {
  //TODO: 3gp isn't supported and needs to be converted
  vidplay();
  videoIsLoaded = false;
  let currentTime = video.currentTime;
  video.src = url;
  video.currentTime = currentTime;
  readyStateChecker = setInterval(function () {
    console.log(video.readyState);
    if (video.readyState == 4) {
      onvideoLoad();
    }
  }, 1000);
}

let inSettings = false;
function settingsOpen() {
  inSettings = true;
  document.getElementById("popupsettings").style.display = "grid";
}

function settingsClose() {
  inSettings = false;
  setTimeout(function () {
    if (inSettings == false) {
      document.getElementById("popupsettings").style.display = "none";
    }
  }, 3000);
}

function closeWindow() {
  window.close();
}

function openVideo(videoId) {
  sessionStorage.setItem("videoId", videoId);
  window.open("videoplayer.html");
  console.log(videoId);
  closeWindow();
}

/************
 *  Converts *
 ************/
function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "Mil.", "Bil.", "Tril."];
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
function formateDescription(string) {
  // TODO: Regex when learned
  let formatedString = `<p class="descTextClass">`;
  let lastUsedChar = "";

  for (let i = 0; i < string.length; i++) {
    switch (string.charAt(i)) {
      case "\n":
        if (lastUsedChar == "\n") {
          formatedString += `</p><hr><p class="descTextClass">`;
        } else {
          formatedString += `</p><p class="descTextClass">`;
        }
        break;
      default:
        formatedString += string.charAt(i);
        lastUsedChar = string.charAt(i);
    }
  }
  return formatedString + "</p>";
}

/********
 * Video *
 ********/

function vidplay() {
  var video = document.getElementById("videoSrc");
  var button = document.getElementById("playButton");
  console.log(videoIsLoaded);

  if (video.paused && videoIsLoaded == true) {
    video.play();
    button.innerHTML = `<img src='/img/pause.svg' alt="" id="playButtonImg">`;
  } else {
    video.pause();
    button.innerHTML = `<img src='/img/play.svg' alt="" id="playButtonImg">`;
  }
}

let vol = document.getElementById("vol-control");
window.setInterval(changevolume(), 1);

function changevolume() {
  var x = vol.value;
  var y = x / 100;

  video.volume = y;
}

function onvideoLoad() {
  clearInterval(readyStateChecker);
  console.log("VIDEO LOADED");
  videoIsLoaded = true;
  vidplay();
}

/*  Timeline  */
// TODO: timeline

/** Key Downs **/
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "32") {
    vidplay();
  }
}
