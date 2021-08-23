let shift = 0;
let forward_disabled = false;
function getYouTubeSubCues(id, lang, callback) {
    let Http = new XMLHttpRequest();
    Http.open("GET", `/api/get_subs.py?id=${id}&lang=${lang}`);
    Http.send();
    Http.onreadystatechange = e => {
    if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
      parseYouTubeSubCues(Http.responseText, callback);
    };
  }
}

// Function with both .js and .py
/*
function getYouTubeSubCues(id, lang, callback) {
  let Http = new XMLHttpRequest();
  Http.open("GET", `/api/getYouTubeSubtitles.js?id=${id}&lang=${lang}`);
  Http.send();

  Http.onreadystatechange = e => {
    let Http = new XMLHttpRequest();
    Http.open("GET", `/api/get_subs.py?id=${id}&lang=${lang}`);
    Http.send();
    Http.onreadystatechange = e => {
    if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
      if(!processed){
          processed = 1;
          parseYouTubeSubCues(Http.responseText, callback);
      }
    }
    else{
      let Http_py = new XMLHttpRequest();
      Http_py.open("GET", `/api/get_subs.py?id=${id}&lang=${lang}`);
      Http_py.send();
      Http_py.onreadystatechange = e => {
      if (Http_py.readyState === XMLHttpRequest.DONE && Http_py.status === 200) {
        if(!processed){
            processed = 1;
            parseYouTubeSubCues(Http_py.responseText, callback);
        }
      }
    }
    }
  };
    };
  }
}
*/

function parseYouTubeSubCues(subSrc, callback) {
  let startTimes = [];
  let texts = [];

  subs = JSON.parse(subSrc);
  for (let sub of subs) {
    startTimes.push(sub["start"]);
    texts.push(sub["text"]);
  }

  callback(startTimes, texts);
}

function getCurrentText(time, startTimes, texts) {
  let start = 0,
    end = startTimes.length - 1;
  while (start < end) {
    let mid = Math.floor((start + end) / 2);
    if (startTimes[mid] <= time && time <= startTimes[mid + 1]) {
      if(mid < 0){
          mid = 0;
      }
      if(mid > startTimes.length - 1){
          mid =  startTimes.length - 1;
      }
      if(mid + shift >= 0 && mid + shift <= startTimes.length - 1){
        if(mid + shift >= startTimes.length - 1){
          forward_disabled = true;
        }
        else{
          forward_disabled = false;
        }
        mid = mid + shift;
      }
      else{
        if(shift < 0){
          shift += 1;
        }
        else if(shift > 0){
          shift -= 1;
        }
      }
      return texts[mid];
    } else if (startTimes[mid] < time) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  if(end < 0){
    end = 0;
  }
  if(end >  startTimes.length - 1){
    end =  startTimes.length - 1;
  }
  if(end + shift >= 0 && end + shift <= startTimes.length - 1){
    if(end + shift >= startTimes.length - 1){
      forward_disabled = true;
    }
    else{
      forward_disabled = false;
    }
    end = end + shift;
  }
  else{
    if(shift < 0){
      shift += 1;
    }
    else if(shift > 0){
      shift -= 1;
    }
  }
  return texts[end];
}
