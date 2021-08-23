let TranslatableLangs = {
  af: "Afrikaans",
  ar: "Arabic",
  cs: "Czech",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  es: "Spanish",
  et: "Estonian",
  fa: "Persian",
  fi: "Finnish",
  fr: "French",
  ga: "Irish",
  he: "Hebrew",
  iw: "Hebrew",
  hi: "Hindi",
  hr: "Croatian",
  hu: "Hungarian",
  it: "Italian",
  ja: "Japanese",
  ka: "Georgian",
  kn: "Kannada",
  ko: "Korean",
  la: "Latin",
  lt: "Lithuanian",
  lv: "Latvian",
  mk: "Macedonian",
  mn: "Mongolian",
  nl: "Dutch",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sk: "Slovak",
  sl: "Slovenian",
  sq: "Albanian",
  sr: "Serbian",
  sv: "Swedish",
  tr: "Turkish",
  uk: "Ukrainian",
  vi: "Vietnamese",
  zh: "Chinese"
};
var langs = {};
var discover = {};
let subs_found = 0;
let success = false;
for(var key in TranslatableLangs){
  langs[key] = TranslatableLangs[key];
  discover[key] = TranslatableLangs[key];
}
function enable_animation(){
  document.getElementById("logo").style.display = "none";
  document.getElementById("search").style.display = "none";
  document.getElementById("manual").style.display = "none";
  document.getElementById("preloader").style.display = "block";
}
function disable_animation(){
  document.getElementById("logo").style.display = "block";
  document.getElementById("search").style.display = "flex";
  document.getElementById("manual").style.display = "block";
  document.getElementById("preloader").style.display = "none";
}
function is_processed(obj){
  for(var i in obj){
    if(obj[i] !== "True" && obj[i] !== "False" && obj[i] !== "Auto")
        return -1;
    else{
      if(obj[i] === "True" || obj[i] === "Auto")
          subs_found = 1;
    }
  }
  return subs_found;
}
function get_subs_list(link){
  fetch(`https://video.google.com/timedtext?type=list&v=${link}`).then(
        res => {
            res.text().then(text => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");
                const availableLanguages = Array.from(xml.getRootNode().children[0].children);

                for (let lang of availableLanguages) {
                    let code = lang.getAttribute("lang_code");
                    code = code.split("-");
                    code = code[0];
                    if(code in TranslatableLangs) {
                        delete TranslatableLangs[code];
                        discover[code] = "True";
                    }
                }
                for(let lang in langs){
                  isYouTubeSubs(link, lang, isSubs => {
                      if (isSubs && lang in TranslatableLangs) {
                        discover[lang] = "Auto";
                      }
                      else{
                        if(isSubs)
                            discover[lang] = "True";
                        else{ 
                            if(discover[lang] !== "True")
                                discover[lang] = "False";
                        }
                      }
                  });
               }
            });
        }
    );
}
function check_subs_list(link){
  if(is_processed(discover) === 1){
        open_video(link);
  }
  else if(is_processed(discover) === -1){
  setTimeout(function(){
    check_subs_list(link);
  }, 500);
}
else{
  success = false;

  document.getElementById("invalid_link").innerText = "Error: No subtitles found";
  document.getElementById("invalid_link").style.color = "red";
  document.getElementById("invalid_link").style.display="block";
  document.getElementById("logo").style.display = "block";
  for(var key in discover){
    discover[key] = "None";
  }
  disable_animation();
}
}

function addSampleVideoLink() {
	document.getElementById("input_field").value = "https://youtu.be/zIwLWfaAg-8";
}

function goToManual() {
  window.location.href = "manual.html"
}

function validVideoId() {
    let link = document.getElementById("input_field").value;
    link = YouTubeGetID(link);
    let img = new Image();
    img.src = "http://img.youtube.com/vi/" + link + "/mqdefault.jpg";
    img.onload = function () {
      if(checkThumbnail(this.width)) {
        document.getElementById("invalid_link").style.display="none";
        success = true;
        enable_animation();
        get_subs_list(link);
        check_subs_list(link);
      }
      else{
        if(link === ""){
          document.getElementById("invalid_link").innerText = "Enter a link";
          document.getElementById("invalid_link").style.color = "#FD6A02";
          document.getElementById("invalid_link").addEventListener("click", addSampleVideoLink);
        }
        else{
          document.getElementById("invalid_link").innerText = "Error: Invalid link";
          document.getElementById("invalid_link").style.color = "red";
          document.getElementById("invalid_link").removeEventListener("click", addSampleVideoLink);
        }
        document.getElementById("invalid_link").style.display="block";
      }
    }
  }

function YouTubeGetID(url){
  var ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/\/?)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  }
  else {
    ID = url[0];
  }
    return ID;
}

function checkThumbnail(width) {
    return (width === 120) ? false : true;
}

function open_video(link){
    let queryString = "?id=" + link + "?langs{";
    for(var i in discover){
      if(discover[i] === "True")
          queryString = queryString + langs[i] + ",";
      else if(discover[i] === "Auto")
          queryString = queryString + langs[i] + "(Auto)" + ",";
    }
    queryString = queryString.slice(0, -1);
    queryString = queryString + "}";
    window.location.href = "lang_choose.html" + queryString;
}

function enter_pressed(e){
    if(e.keyCode == 13){
        validVideoId();
    }
}

function isYouTubeSubs(id, lang, callback) {
  let Http = new XMLHttpRequest();
  Http.open("GET", `/api/getYouTubeSubtitles.js?id=${id}&lang=${lang}`);
  Http.send();

  Http.onreadystatechange = e => {
    if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
      callback(true);
    }
    if (Http.readyState === XMLHttpRequest.DONE && Http.status === 403) {
      callback(false);
    }
  };
}

let visibleLogo = true;
let keyboardup = false;
let prev_height = $(window).height();
let prev_width = $(window).width();

function hideLogo() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    if($(window).width() > $(window).height() && keyboardup == false) {
      document.getElementById("logo").style.display = "none";
    }
    keyboardup = true;
  }
}

$(window).resize(function(){
  if($(window).height() > prev_height && !success) {
    document.getElementById("logo").style.display = "block";
    if($(window).width() == prev_width) {
    	keyboardup = false;
    }
    if($(window).height() < screen.height / 3 && $(window).width() > $(window).height()){
      document.getElementById("logo").style.display = "none";
    }
    else{
      document.getElementById("logo").style.display = "block";
    }
  }
  else if(keyboardup == true && $(window).height() < prev_height && $(window).width() > prev_width) {
  	document.getElementById("logo").style.display = "none";
    keyboardup = true;
  }
  prev_height = $(window).height();
  prev_width = $(window).width();
});
