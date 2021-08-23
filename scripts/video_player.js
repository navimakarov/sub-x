let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
let queries = queryString.split("&");
queries=queries[0].split("?");
let videoId = queries[0].slice(3);
let srcLang = queries[2].slice(2);
let dstLang = queries[1].slice(2);

const watchSection = document.getElementById("watch");
let videoPlayer;
watchYoutube();
setInterval(function(){
  try{
    videoPlayer.change_size();
  }
  catch(error){
    ;
  }
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => Promise.resolve(err));
} else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen().catch(err => Promise.resolve(err));
} else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen().catch(err => Promise.resolve(err));
} else if (document.msExitFullscreen) {
    document.msExitFullscreen().catch(err => Promise.resolve(err));
}
else{
  document.exitFullscreen().catch(err => Promise.resolve(err));
}
}, 1);

function watchYoutube() {
  videoPlayer = new YouTubeVideoPlayer(videoId, srcLang, dstLang);
  videoPlayer.addSubtitles(srcLang);
  watchSection.appendChild(videoPlayer.element);
  const transBlock = document.createElement("div");
  transBlock.id = "transBlock";
  watchSection.appendChild(transBlock);
  const subBlock = document.createElement("div");
  subBlock.id = "subBlock";
  watchSection.appendChild(subBlock);
  setInterval(function() {
    if(videoPlayer != undefined){
        document.getElementById("preloader").style.display = "none";
        document.getElementById("watch").style.opacity = 1;
        video_loaded = 1;
    }
  }, 1000);
}