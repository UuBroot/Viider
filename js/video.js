/***********
*   Vars   * 
***********/
let videoIsLoaded = false;
let readyStateChecker;
let canPauseVideo = true;
let theatermode = false;
let videoId;
/***********
* Document *
***********/
let video = document.getElementById("videoSrc");
let preLoad = document.getElementById("preLoad");

/*****************
* On Window Load *
******************/
window.onload = function () {
    //make params
    let params = new URLSearchParams(document.location.search);
    videoId = params.get('id')

    //generate Video
    getApiData(videoId);



    //i don't know what this does :(
    readyStateChecker = setInterval(function () {
        console.log(video.readyState);
        if (video.readyState == 4) {
            onvideoLoad();
        }
    }, 1000);
};


/************
* Functions *
************/

//when clicking on the video
function openVideo(videoId) {
    window.open("videoplayer.html");
    console.log(videoId);
    closeWindow();
}

//Close the window
function closeWindow() {
    window.close();
}

/** Key Downs **/
document.onkeyup = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "32") {
    vidplay();
  }
  else if (e.keyCode == "70") {
    video_fullscreen();
  }
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
  
/************************
*   Generate the Things * 
************************/
function getApiData(videoId) {
    //gets the instants url
    let activeInstanceUrl = getActiveInstance()
    console.log("Active Instance: "+activeInstanceUrl);

    console.log(activeInstanceUrl + "/api/v1/videos/" + videoId)
  
    fetch(activeInstanceUrl + "/api/v1/videos/" + videoId)
      .then((response) => response.json())
      .then((data) => {
        
        //Checks for wrong Video
        if(data.error == "Video unavailable"){
          preLoad.innerHTML = data.error;
        }

        console.log(data);

        //set Website Title
        document.title = data.title;

        //PutUrlInVideo
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
              <button onclick="changeVideoTo('${data.formatStreams[i].url}')" class="videoQualityChangeButton">${data.formatStreams[i].qualityLabel}</button>
            `;
          }
        }
  
        //makes commands
        makeComments(videoId);
  
        //makes the description and other simular stuff
        makedescrtiptionandheader(data);
  
///Recommendet Videos///
        //clear just because
        document.getElementById("rightVidScreen").innerHTML = ``;

        //puts in the Videos

        for (let i = 0; i < data.recommendedVideos.length; i++) {
          switch (data.recommendedVideos[i].type) {
            case "video":
              document.getElementById("rightVidScreen").innerHTML += `
                <div id="vid-box" onclick="openVideo('${data.recommendedVideos[i].videoId}')" style="background-image: url(${data.recommendedVideos[i].videoThumbnails[3].url});">
                  
                  <div id="touchBoxforHover">
                      
                    <div id="vid-box-footer-box">
                        
                      <div id="vid-box-footer">
                          <p id="vidTitle">${data.recommendedVideos[i].title}</p>
                        <hr>
                          <p>${abbreviateNumber(data.recommendedVideos[i].viewCount)} Views</p>
                      </div>
  
                      <div id="vid-box-footer" style="bottom:0px;position:absolute  ;">
                          <p>${data.recommendedVideos[i].publishedText}</p>
                        <hr>
                          <p>${calculateTime(data.recommendedVideos[i].lengthSeconds)}</p>
                        <hr>
                          <p>${data.recommendedVideos[i].author}</p>
                      </div>
                      
                    </div>
                  
                  </div>
              
                </div>
              `;
              break;
            case "playlist":
              document.getElementById("rightVidScreen").innerHTML += `
                <div id="playlist-box" onclick="" style="background-image: url(${data.recommendedVideos[i].videoThumbnails[3].url})">
                  
                  <div id="touchBoxforHover">
                              
                    <div id="vid-box-footer">
                        <p id="vidTitle">${data.recommendedVideos[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data.recommendedVideos[i].viewCount)} Videos</p>
                    </div>
                    
                  </div>
  
                </div>
              `;
              break;
            case "shortVideo":
              // TODO: author page
              document.getElementById("rightVidScreen").innerHTML += `
                <div id="vid-box" onclick="openVideo('${data.recommendedVideos[i].videoId}')" style="background-image: url(${data.recommendedVideos[i].videoThumbnails[3].url});">
                  
                  <div id="touchBoxforHover">
  
                    <div id="vid-box-footer-box">
                    
                      <div id="vid-box-footer">
                          <p id="vidTitle">${data.recommendedVideos[i].title}</p>
                        <hr>
                          <p>${abbreviateNumber(data.recommendedVideos[i].viewCount)} Views</p>
                      </div>
  
                      <div id="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
                          <p>${data.recommendedVideos[i].publishedText}</p>
                        <hr>
                          <p>${calculateTime(data.recommendedVideos[i].lengthSeconds)}</p>
                        <hr>
                          <p>${data.recommendedVideos[i].author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              break;
          }
        }
        //end of fetch
      });
}

//Genterate the other things
function makedescrtiptionandheader(data) {
    //fetches the dislikes
    fetch("https://returnyoutubedislikeapi.com/votes?videoId="+data.videoId)
      .then ((response) => response.json())
      .then (dlikedata => {
        console.log(data);
        
        //Description Header
        document.getElementById("desHeader").innerHTML += `
        <div style="display: flex;justify-content: space-between;">
            
            <h2>${data.title}</h2>
            
            <div>
              <p>${data.publishedText}</p>
              <p>${abbreviateNumber(data.viewCount)} Views</p>
            </div>
        
        </div>
      
        <div style="display: flex;justify-content: space-between;">
          
            <div style="display:flex;align-items:center;" onclick="creatorPage('${data.authorUrl}')">
                
                <img src="${data.authorThumbnails[2].url}" alt="" style="width:40px;height40px;margin-right:1vw;">
                <p>${data.author}</p>
                <button style="width:70px;height:25px;padding:0px;margin-left:0.5vw;">Subscribe</button>
          
            </div>
          
            <div style="display:flex;background-color:#382A38;width:15vw;justify-content:space-between;border-radius:10px;padding:10px;">
                
                <p>${abbreviateNumber(dlikedata.likes)} Likes</p>
                <p>${abbreviateNumber(dlikedata.dislikes)} Dislikes</p>
                <img onclick="copyVideo('${data.videoId}')" src="/img/share.svg" alt="Share" id="shareButton"></img>
            
            </div>
      
        </div>

        <hr>

        <div>
            <p>${formateDescription(data.descriptionHtml)}</p>
        </div>
      
        <div id="commands"></div>
        `;
      })
}
/*ActiveInstance*/

function makeComments(id) {
    //get active instance url
    let activeInstanceUrl = getActiveInstance();
    fetch(activeInstanceUrl + "/api/v1/comments/" + id)
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        
        //print commands
        for (let i = 0; i < data.comments.length; i++) {
          document.getElementById("commands").innerHTML += `
                    <div id="comment">
                      <div onclick="creatorPage('${data.comments[i].authorUrl}')">
                        <h3 id="commentername">${data.comments[i].author}</h3>
                        <img src="${data.comments[i].authorThumbnails[0].url}" alt="">
                      </div>
                        <p>${data.comments[i].content}</p>
                    </div>
                   `;
        }

        //more comments
        document.getElementById("commands").innerHTML += `
            <button onclick="makeCommants(${id+data.continuation})">more</button>
        `;
        
      });
}
  


/***************
* Video Player *
***************/

videoSrc.addEventListener("pause", (event) => {
  openSettings();
});

videoSrc.addEventListener("play", (event) => {
  closeSettings();
});



//pauses of stops the video
function vidplay() {

    console.log("canpausevideo: " + canPauseVideo);
  
    if(canPauseVideo == true){
      canPauseVideo = false;
      
      //for no spam
      setTimeout(function() {
        canPauseVideo = true;
      },100);
      
      console.log(videoIsLoaded);
  
      //changes the button to the correct symbol

      if (video.paused && videoIsLoaded == true) {
        video.play();
      } else {
        video.pause();
      }
    }
}
  
//Volume
let vol = document.getElementById("vol-control");
window.setInterval(changevolume(), 1);
  
function changevolume() {
    console.log(vol)
    var x = document.getElementById("vol-control").value;
    var y = x / 100;
  
    video.volume = y;
}
  
//When Video is loaded
function onvideoLoad() {
    document.getElementById("loading").style.display = "none"
    clearInterval(readyStateChecker);
    console.log("VIDEO LOADED");
    videoIsLoaded = true;
    vidplay();

    /*AOS*/
    AOS.refresh();
    //Does the animation
    AOS.init({
      duration: 2000,
    })
}
  
//Fullscreen
function video_fullscreen() {
    if (videoSrc.requestFullscreen) {
      videoSrc.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      videoSrc.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      videoSrc.msRequestFullscreen();
    }
}
  
//Theater Mode
function theatermodeToggle() {
    if (theatermode == true) {
      theatermode = false;
      document.getElementById("rightVidScreen").style.display = "grid";
      document.getElementById("leftVidScreen").style.width = "100%";
      document.getElementById("videoSrc").style.height = "auto";
      document.getElementById("leftVidScreen").style.marginLeft = "0vw"
    } else {
      document.getElementById("videoSrc").scrollIntoView() //Scrolls to full screen
      theatermode = true;
      document.getElementById("rightVidScreen").style.display = "none";
      document.getElementById("leftVidScreen").style.width = "90vw";
      document.getElementById("leftVidScreen").style.marginLeft = "5vw"
      document.getElementById("videoSrc").style.height = Screen.height+"vw";
    }
}
  
///The video Settings///
let inVideoSettings = false;

function openSettings() {
  document.getElementById("videoControlls").style.display = "flex";
  inVideoSettings = true;
}

function closeSettings() {
  document.getElementById("videoControlls").style.display = "none";
  inVideoSettings = false;
}
//wip

//Changes the Video to a different URL
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
  
//Copy the video to the clipboard
function copyVideo(videoLink) {
    document.getElementById("shareButton").style.animation = "rotatePress 2s";
    setTimeout(function () {
      document.getElementById("shareButton").style.animation = "none";
    }, 2000);
    console.log("https://www.youtube.com/watch?v=" + videoLink);
    navigator.clipboard.writeText("https://www.youtube.com/watch?v=" + videoLink);
}
/*  Timeline  */

//changes the video timeline to the current moment
setInterval(changeVideoMoment,1000);

function changeVideoMoment() {
    let currentVidPercentage = (video.currentTime/video.duration)*1000;
    document.getElementById("video-timeline").value = currentVidPercentage;
}
  
function changeVideoMomentTime() {
    video.currentTime = (document.getElementById("video-timeline").value*video.duration)/1000;
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
    const NUMBER_OF_SLASH_TO_GO_TO = 3
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
      //after / 
      if(slashFound>=3) { //2 for local hosting 3 for github
        console.log(cleanChanalUrl)
        cleanChanalUrl += url.charAt(i);
      }
    }

    urlREALLYtoUse += urlToUse + "channels.html?id=" + cleanChanalUrl;
    console.log(urlREALLYtoUse)
    window.open(urlREALLYtoUse);
  })()
}