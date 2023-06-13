let currentSettings = {
    "color": "Dark",
    "instance": "https://invidious.lunar.icu",
    "webtocopy": "inv"
}

function closeSettings() {
    window.location = "../pages/main.html"
}

function applySettings() {
    //Color
    document.documentElement.style.mainPurple
}

function downloadJson(){
    let exportObj = localStorage["Viider"];
    let exportName = "download";

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function openUpload() {
    document.getElementById("uploadDialog").showModal(); //Shows the dialog

}

function uploadJson() {
    var input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = e => { 
    
        // getting a hold of the file reference
        var file = e.target.files[0]; 
    
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
    
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = JSON.parse(readerEvent.target.result) ; // this is the content!
            console.log( content );
            if(content == undefined){
                console.log("Guad")
            }
            else {
                localStorage["Viider"] = content;
                document.getElementById("uploadDialog").close(); //hides the dialog
                console.log("writtern")
            }
        }
    
    }
    
    input.click();
}    