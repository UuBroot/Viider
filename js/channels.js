let chanalId;
let activeInstance;

async function asyncWindowLoad(){
  activeInstance = await getActiveInstance();

  console.log("active instalce: ",activeInstance)

  //generate Video    
  callApi(chanalId);
}

//Close the window
function closeWindow() {
    window.close();
}

/***************
*   Api Call   *
***************/
function callApi(chanalId) {
  
    console.log(activeInstance + "/api/v1/channels" + chanalId);
    fetch(activeInstance + "/api/v1/channels" + chanalId)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        generate(data)
    })
}

window.onload = function () {
  asyncWindowLoad()

  //make params
  let params = new URLSearchParams(document.location.search);
  chanalId = params.get('id')

  console.log(chanalId);
};

/*********
 * Algos *
 *********/
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
function calculateTime(time_s) {
  var minute = Math.floor(time_s / 60);
  var rest_seconds = time_s % 60;
  return minute + "min " + rest_seconds + "s";
}
/************
 * Generate *
 ************/

function generate(data) {
    AOS.refresh();
    //Does the animation
    AOS.init({
      duration: 2000,
    })
    console.log("generates stuff")
    //set Website Title
    try {
      document.title = data.author + "'s Channel";
    }catch {
      console.log("no author found")
    }

    //Banner
    try {
      document.getElementById("banner").src = data.authorBanners[0].url;
    }catch {
      console.log("nobannerfound")
    }
    //Author Pic
    try {
      document.getElementById("chanalImg").src = data.authorThumbnails[3].url;
    }catch {
      console.log("no profile pic found")
    }

    //Author name
    try {
      document.getElementById("channelName").innerHTML = data.author;
    }catch {
      console.log("no author found")
    }

    //Subs
    try {
      document.getElementById("chanalSubs").innerHTML = abbreviateNumber(data.subCount) + " Subscriber"
    }catch {
      console.log("subs")
    }

    //Descrtiotion
    try {
      document.getElementById("description").innerHTML = data.descriptionHtml;
    }catch {
      console.log("no descrition")
    }

    //ChanalCreateTime
    try {
      document.getAnimations("creationTime").innerHTML = `Joined on ${calculateTime(data.joined)}`;
    }catch {
      console.log("creation time")
    }


    //Verified

    try {
      if (data.authorVerified){
        document.getElementById("verified"). innerHTML = "✓";
      }    
    }catch {
      console.log("verifiecation failed")
    }

    //Generates the Videos
    try {
      let main = document.getElementById("mainBox")
      for (let i = 0; i < data.latestVideos.length; i++) {
          switch (data.latestVideos[i].type) {
            case "video":
              main.innerHTML += `
                <div id="vid-box" onclick="openVideo('${data.latestVideos[i].videoId}')" style="background-image: url(${data.latestVideos[i].videoThumbnails[4].url});">
                  
                  <div id="touchBoxforHover">
                      
                    <div id="vid-box-footer-box">
                        
                      <div id="vid-box-footer">
                          <p id="vidTitle">${data.latestVideos[i].title}</p>
                        <hr>
                          <p>${abbreviateNumber(data.latestVideos[i].viewCount)} Views</p>
                      </div>
  
                      <div id="vid-box-footer" style="bottom:0px;position:absolute  ;">
                          <p>${data.latestVideos[i].publishedText}</p>
                        <hr>
                          <p>${calculateTime(data.latestVideos[i].lengthSeconds)}</p>
                        <hr>
                          <p>${data.latestVideos[i].author}</p>
                      </div>
                      
                    </div>
                  
                  </div>
              
                </div>
              `;
              break;
            case "playlist":
              main.innerHTML += `
                <div id="playlist-box" onclick="" style="background-image: url(${data.latestVideos[i].playlistThumbnail});">
                  
                  <div id="touchBoxforHover">
                              
                    <div id="vid-box-footer">
                        <p id="vidTitle">${data.latestVideos[i].title}</p>
                      <hr>
                        <p>${abbreviateNumber(data.latestVideos[i].videoCount)} Videos</p>
                    </div>
                    
                  </div>
  
                </div>
              `;
              break;
            case "shortVideo":
              // TODO: author page
              main.innerHTML += `
                <div id="vid-box" onclick="openVideo('${data.latestVideos[i].videoId}')" style="background-image: url(${data[i].videoThumbnails[4].url});">
                  
                  <div id="touchBoxforHover">
  
                    <div id="vid-box-footer-box">
                    
                      <div id="vid-box-footer">
                          <p id="vidTitle">${data.latestVideos[i].title}</p>
                        <hr>
                          <p>${abbreviateNumber(data.latestVideos[i].viewCount)} Views</p>
                      </div>
  
                      <div id="vid-box-footer" style="bottom:0px;position:absolute;display:grid;">
                          <p>${data.latestVideos[i].publishedText}</p>
                        <hr>
                          <p>${calculateTime(data.latestVideos[i].lengthSeconds)}</p>
                        <hr>
                          <p>${data.latestVideos[i].author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              break;
          }
      }
    }catch {
      console.log("videos could not be :(")
    }
}