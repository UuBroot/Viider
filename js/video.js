/***********
*   Vars   * 
***********/
let readyStateChecker;
let canPauseVideo = true;
let theatermode = false;
let videoId;
let activeInstance;
/***********
* Document *
***********/
let video = document.getElementById("videoSrc");
let preLoad = document.getElementById("preLoad");
let videoTime = document.getElementById("videoTime");

/*****************
* On Window Load *
******************/
window.onload = function () {
  asyncWindowLoad()
  //make params
  let params = new URLSearchParams(document.location.search);
  videoId = params.get('id')
};

async function asyncWindowLoad(){
  activeInstance = await getActiveInstance();

  console.log("active instalce: ",activeInstance)

  //generate Video
  getApiData(videoId);
}

/************
* Functions *
************/

//when clicking on the video
function openVideo(videoId) {
    window.open("videoplayer.html");
    console.log(videoId);
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
    console.log("Active Instance: "+activeInstance);

    console.log(activeInstance + "/api/v1/videos/" + videoId)
  
    fetch(activeInstance + "/api/v1/videos/" + videoId)
      .then((response) => response.json())
      .then((data) => {
        onvideoLoad()
        //Checks for wrong Video
        if(data.error == "Video unavailable"){
          preLoad.innerHTML = data.error;
        }
        else if (data.error == "Sign in if you've been granted access to this video") {
          preLoad.innerHTML = "Video can't be accsessed.";
        }

        console.log(data);

        //set Website Title
        document.title = data.title;

        //PutUrlInVideo
        try {
          console.log("url number that put in: ",data.formatStreams.length-1)
          changeVideoTo(data.formatStreams[data.formatStreams.length-1].url)//Checks for the best video quality
        }catch ({ name, message }){
          alert("error loading video")
        }

  
        //PutInPreview
        video.poster = data.videoThumbnails[0].url;
        
        //Sets Length
        videoTime.innerHTML = calculateTime(data.lengthSeconds, "minimal");

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
          console.log(data.recommendedVideos[i].type)


              document.getElementById("rightVidScreen").innerHTML += `
                <div class="vid-box" onclick="openVideo('${data.recommendedVideos[i].videoId}')" style="background-image: url(${data.recommendedVideos[i].videoThumbnails[3].url});">
                  
                  <div class="touchBoxforHover">
                      
                  <div class="vid-box-footer-box">
                        
                  <div class="vid-box-footer">
                      <p id="vidTitle">${data.recommendedVideos[i].title}</p>
                    <hr>
                      <p>${abbreviateNumber(data.recommendedVideos[i].viewCount)} Views</p>
                  </div>

                  <div class="vid-box-footer" style="bottom:0px;position:absolute  ;">
                      <p>Recommended</p>
                      <hr>
                      <p>${calculateTime(data.recommendedVideos[i].lengthSeconds)}</p>
                      <hr>
                      <p onclick="creatorPage('${data.recommendedVideos[i].authorUrl}')" class="authorNamePageButton">${data.recommendedVideos[i].author}</p>
                  </div>
                  
                </div>
              
                  </div>
              
                </div>
              `;



        }

        //SubButtonChannel

        document.getElementById('subButton').setAttribute( "onClick", `writeChanel('${data.authorUrl}')` );
        
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
      
        <div id="descriptionFooter">
          
            <div style="display:flex;align-items:center;" >
                
                <img src="${data.authorThumbnails[2].url}" alt="" style="width:40px;height40px;margin-right:1vw;" onclick="creatorPage('${data.authorUrl}')">
                <p onclick="creatorPage('${data.authorUrl}')">${data.author}</p>
                <button id="subButton" onclick="writeChanel('${data.authorId}', '${data.author}')">Subscribe</button>

            </div>



            <div id="smallBoxDesc">
                
                <p style="display:flex;align-items:center">${abbreviateNumber(dlikedata.likes)} <img src="../img/like.svg" width="20vw"></p>
                <p style="display:flex;align-items:center">${abbreviateNumber(dlikedata.dislikes)} <img src="../img/dislike.svg" width="20vw"></p>
                <p onclick="addToPlaylistButtonPressed()" id="addToPlaylistButton">
                  <img src="../img/flag.svg" width="10px" style="margin-right:10px">
                  Add to playlist
                </p>
                <img onclick="copyVideo()" src="../img/share.svg" alt="Share" id="shareButton"></img>
            
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

function makeComments(id) {
    fetch(activeInstance + "/api/v1/comments/" + id)
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
            <button onclick="makeCommants('${data.continuation}')">more</button>
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
      
  
      //changes the button to the correct symbol

      if (video.paused && video.readyState == 4) {
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
    document.getElementById("loading").style.display = "none";
    console.log("VIDEO LOADED");

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
      video.style.height = "auto";
      document.getElementById("leftVidScreen").style.marginLeft = "0vw"
    } else {
      video.scrollIntoView() //Scrolls to full screen
      theatermode = true;
      document.getElementById("rightVidScreen").style.display = "none";
      document.getElementById("leftVidScreen").style.width = "90vw";
      document.getElementById("leftVidScreen").style.marginLeft = "5vw"
      video.style.height = Screen.height+"vw";
    }
}
  
///The video Settings///
let inVideoSettings = false;

function openSettings() {
  document.getElementById("videoControlls").style.opacity = "1";
  inVideoSettings = true;
}

function closeSettings() {
  if(!video.paused) {
    document.getElementById("videoControlls").style.opacity = "0";
    inVideoSettings = false;
  }
}
//wip

//Changes the Video to a different URL
function changeVideoTo(url) {

    //TODO: 3gp isn't supported and needs to be converted
    vidplay();
    let currentTime = video.currentTime;
    video.src = url;
    video.currentTime = currentTime;
}
  
//Copy the video to the clipboard
function copyVideo() {
    document.getElementById("shareButton").style.animation = "rotatePress 2s";
    setTimeout(function () {
      document.getElementById("shareButton").style.animation = "none";
    }, 2000);
    console.log(window.location.href);
    navigator.clipboard.writeText(window.location.href);
}


/*  Timeline  */

//changes the video timeline to the current moment
setInterval(changeVideoMoment,1000);

function changeVideoMoment() {
  console.log(video.currentTime/video.duration* 1000)
  document.getElementById("video-timeline").value = video.currentTime/video.duration*1000
}
  
function changeVideoMomentTime() {
  video.currentTime = Math.floor((document.getElementById("video-timeline").value*video.duration)/1000);
}

//Checks for if video is loading
setInterval(function () {
  console.log("video state: ",video.readyState)
  if (video.readyState < 4) {
      document.getElementById("loadingVideo").style.display = "block";
  }
  else {
    document.getElementById("loadingVideo").style.display = "none";
  }
}, 1000);

async function addToPlaylistButtonPressed() {
  document.getElementById("existingPlaylists").innerHTML = "";

  try{
    let json = JSON.parse(localStorage["Viider"]);

    for(let i = 0;i<json.list.length;i++){

      document.getElementById("existingPlaylists").innerHTML += `
        <div onclick="addToPlaylist('${json.list[i].name}')">${json.list[i].name}</div>
      `;
  
    }
  }
  catch{
    document.getElementById("existingPlaylists").innerHTML = "No playlists found"
  }




  document.getElementById("playlistDialog").showModal(); //Shows the dialog
}

function addToPlaylist(name = document.getElementById("dialogPlaylistName").value) {
  if(name == ""){
    alert("no name given")
  }
  else{
    document.getElementById("playlistDialog").close();

    console.log("added to playlist: ", name)
  
    writeVideoToLocalStorage(name, videoId);
  }
}