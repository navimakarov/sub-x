let prevText = "";
let youtubeLoadState = 0;
let video_loaded = 0;
const waitingForIframeAPI = [];

function onYouTubeIframeAPIReady() {
  youtubeLoadState = 2;
  while (waitingForIframeAPI.length > 0) {
    waitingForIframeAPI.pop()();
  }
}


function encode(str){
  let encoded_string = "";
  for(var i = 0; i < str.length; i++){
    if(str[i] == '\n'){
      encoded_string = encoded_string + " ".charCodeAt(0);
    }
    else{
        encoded_string = encoded_string + str.charCodeAt(i);
    }
    encoded_string = encoded_string + ',';
  }
  return encoded_string;
}

function word_info(word, wordSpan){
    let meanings;
    let translation;
    let word_on_button = wordSpan.innerHTML;
    wordSpan.innerHTML = "";
    wordSpan.classList.add("loading");
    wordSpan.id = "pure_text";
    let Http = new XMLHttpRequest();
    Http.open("GET", `/api/word_info.py?word=${encode(word)}&src=${srcLang}&dst=${dstLang}`);
    Http.send();
    Http.onreadystatechange = e => {
    if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
      meanings = Http.responseText.split(",");
    };
    if(meanings.length <= 1){
      let Http_translate = new XMLHttpRequest();
      let query = encode(word);
      Http_translate.open("GET", `/api/translation.py?text=${query}&src=${srcLang}&dst=${dstLang}`);
      Http_translate.send();
      Http_translate.onreadystatechange = e => {
      if (Http_translate.readyState === XMLHttpRequest.DONE && Http_translate.status === 200) {
        translation = Http_translate.responseText;
      };
      if(translation != ""){
        let firestring = "<h1>"
        firestring += word;
        firestring += "</h1>";
        firestring += "<ul>";
        firestring += "<li>";
        firestring += translation;
        firestring += "</li>";
        firestring += "</ul>";
        Swal.fire({
          showCloseButton: true,
          html: firestring,
          showClass: {
              popup: 'animated fadeInDown faster'
          },
          hideClass: {
              popup: 'animated fadeOutUp faster'
          },
          customClass: 'swal_popup'
      });
      }
      else{
        Swal.fire({
          showCloseButton: true,
          icon: 'error',
          title: 'Oops...',
          text: "No translations found"
        });
      }
    }
    }
    else{
      let firestring = "<h1>"
      firestring += word;
      firestring += "</h1>";
      firestring += "<ul>";
      for(var i = 0; i < meanings.length - 1; i++){
        firestring += "<li>";
        firestring += meanings[i];
        firestring += "</li>"
      }
      firestring += "</ul>";
      Swal.fire({
        showCloseButton: true,
        html: firestring,
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        },
        customClass: 'swal_popup'
    });
    }
    wordSpan.classList.remove("loading");
    wordSpan.innerHTML = word_on_button;
    wordSpan.id = "word-button";
  }
}


class YouTubeVideoPlayer{

  constructor(videoId, srclang, translang) {
    this.element = document.createElement("div");
    this.element.id = "video-player";
    this.playerContainer = document.createElement("div");
    this.playerContainer.className = "video-player-youtube-container";
    this.element.appendChild(this.playerContainer);

    this.videoId = videoId;
    this.srclang = srclang;
    this.translang = translang;

    if (youtubeLoadState !== 2) {
      youtubeLoadState = 1;
      const youtubeScript = document.createElement("script");
      youtubeScript.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(youtubeScript, firstScriptTag);
      waitingForIframeAPI.push(this.makePlayer.bind(this));
    } else {
      this.makePlayer();
    }
  }


  addSubs(startTimes, texts) {
    this.subBlock = document.getElementById("subBlock");
    this.subBlock.onmouseover = function(){
      videoPlayer.pause();
    }
    
    setInterval(() => {
      this.text = getCurrentText(this.currentTime, startTimes, texts);
      try{
      if(this.text != prevText){
          transBlock.innerText = "...";
          let Http = new XMLHttpRequest();
          let query = encode(this.text);
          Http.open("GET", `/api/translation.py?text=${query}&src=${srcLang}&dst=${dstLang}`);
          Http.send();
          Http.onreadystatechange = e => {
          if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
              transBlock.innerText = Http.responseText;
          };
          }
      }
    }
    catch(error){
      ;
    }
      let punctuation = ".’\"„'()[]{}<>:,‒–—―…!.«»-‐?‘’“”;/⁄␠·&@*\\•^¤¢$€£¥₩₪†‡°¡¿¬#№%‰‱¶′§~¨_|¦’+=。 ，؟،【】〜「」『』〽׆♪0123456789";
      this.word = "";
      this.not_word = "";
      this.elem = '';
      if (this.text && this.text !== prevText) {
        document.getElementById("subBlock").innerHTML = "";
        let wordSpan = document.createElement("p");
        wordSpan.id = "arrow";
        wordSpan.innerHTML = "<<   ";
        wordSpan.onclick = function(){
          videoPlayer.pause();
          shift -= 1;
        };
        this.subBlock.appendChild(wordSpan);
        for(var i = 0; i < this.text.length; i++){
          this.elem = this.text.charAt(i);
          if(this.elem === '\n')
              this.elem = " ";
          if(punctuation.indexOf(this.elem) > -1){
            if(this.elem !== '-' && this.elem !== '\''){
              this.subs_add_content("word");
            }
            else{
              if(i == 0 || i == this.text.length - 1){
                this.subs_add_content("word");
              }
              else{
                if(punctuation.indexOf(this.text.charAt(i-1)) === -1 && this.text.charAt(i-1) !== "\n" && punctuation.indexOf(this.text.charAt(i+1)) === -1){
                  this.word = this.word + this.elem;
                }
                else{
                  this.subs_add_content("word");
                }
              }
            }
          }
          else{
            this.subs_add_content("not_word");
          }
        }
        if(this.word.length !== 0){
            this.subs_add_content("word");
            this.not_word = this.not_word.slice(1);
        }
        this.subs_add_content("not_word");
        wordSpan = document.createElement("p");
        wordSpan.id = "arrow";
        wordSpan.innerHTML = "   >>";
        wordSpan.onclick = function(){
          videoPlayer.pause();
          if(!forward_disabled)
              shift += 1;
        };
        this.subBlock.appendChild(wordSpan);
        prevText = this.text;
      }
    }, 1);
  }

  makePlayer() {
    const placeholder = document.createElement("div");
    placeholder.id = "player";
    this.playerContainer.appendChild(placeholder);
    this.player = new YT.Player("player", {
      videoId: this.videoId,
      playerVars: {
        controls: 1,
        disablekb: 0,
        modestbranding: 0,
        fs: 0,
        rel: 0,
        showinfo: 1,
        iv_load_policy: 3,
        cc_load_policy: 3,
        playsinline: 1
      },
      events: {
        onPlayerReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this)
      }
    });
    if (this.player) {
      this.change_size();
    }
  
  }

  get currentTime() {
    return this.player && this.player.getCurrentTime
      ? this.player.getCurrentTime()
      : 0;
  }

  onPlayerStateChange(state) {
    switch(state.data){
      case YT.PlayerState.PAUSED:
        transBlock.style.display = "block";
        break;
      case YT.PlayerState.PLAYING:
        shift = 0;
        transBlock.style.display = "none";
        break;
    }
  }

  onPlayerReady(event) {
    event.target.setVolume(100);
    resolve(this.player);
    
  }


  addSubtitles(lang) {
    getYouTubeSubCues(this.videoId, lang, (startTimes, texts) => {
      this.addSubs(startTimes, texts);
    });
  }
  get player_size(){
    return this.element.getBoundingClientRect();
  }
  change_size(){
      let size = this.element.getBoundingClientRect();
      this.player.setSize(
        size.width,
        Math.min((size.width * 9) / 16, 0.8*window.innerHeight)
      );
      let subs_size = document.getElementById("subBlock").clientHeight;
      if((size.width * 9) / 16 < 0.8*window.innerHeight){
        document.getElementById("watch").style.padding = (Math.floor(window.innerHeight - subs_size - (size.width * 9) / 16) * 0.25).toString() + "px";
        document.getElementById("video-player").style.width = "85vw";
        document.getElementById("subBlock").style.width = "85vw";
        document.getElementById("transBlock").style.width = "85vw";
        document.getElementById("watch").style.paddingBottom = "3vw";
        if(video_loaded)
            document.getElementById("social_media").style.display = "flex";
      }
      else{
        document.getElementById("watch").style.padding = "0px";
        document.getElementById("video-player").style.width = "98vw";
        document.getElementById("subBlock").style.width = "98vw";
        document.getElementById("transBlock").style.width = "98vw";
        document.getElementById("social_media").style.display = "none";
      }
  }

  pause(){
    this.player.pauseVideo();
  }

  play(){
    this.player.playVideo();
  }

  subs_add_content(type){
    if(type === "word"){
        if(this.word.length !== 0){
          let wordSpan = document.createElement("p");
          wordSpan.setAttribute("id", "word-button");
          let word = this.word;
          wordSpan.onclick = function(){
            videoPlayer.pause();
            word_info(word, wordSpan);
          };
          wordSpan.appendChild(document.createTextNode(this.word));
          this.subBlock.appendChild(wordSpan);
          this.word = "";
        }
        this.not_word = this.not_word + this.elem;
    }
    else{
        if(this.not_word.length !== 0){
          let wordSpan = document.createElement("p");
          wordSpan.appendChild(document.createTextNode(this.not_word));
          this.subBlock.appendChild(wordSpan);
          this.not_word = "";
        }
        this.word = this.word + this.elem;
    }
  }

}