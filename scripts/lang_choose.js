let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log(queryString);
let queries = queryString.split("?");
let link = queries[0].slice(3);
let langs = queries[1].slice(6, -1);
langs = langs.split(",");

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

  let select = document.getElementById("slct_foreign");
  langs.sort();

  for(var i = 0; i < langs.length; i++){
    let option = document.createElement("option");
    option.text = langs[i];
    select.add(option);
  }

  function open_player(){
    let native_lang = document.getElementById("slct_native");
    native_lang = native_lang.options[native_lang.selectedIndex].text;
    let foreign_lang = document.getElementById("slct_foreign");
    foreign_lang = foreign_lang.options[foreign_lang.selectedIndex].text;
    foreign_lang = foreign_lang.split("(")[0];
    if(native_lang == "Native language" || foreign_lang == "Video language"){
      Swal.fire({
        showCloseButton: true,
        icon: 'error',
        title: 'Error...',
        text: "Please choose all options"
      });
    }
    else if(native_lang == foreign_lang){
      Swal.fire({
        showCloseButton: true,
        icon: 'error',
        title: 'Error...',
        text: "Languages cannot match"
      });
    }
    else{
      for(var key in TranslatableLangs){
        if(TranslatableLangs[key] === native_lang){
          native_lang = key;
          break;
        }
      }
      for(var key in TranslatableLangs){
        if(TranslatableLangs[key] === foreign_lang){
          foreign_lang = key;
          break;
        }
      }
      let queryString = "?id=" + link + "?n=" + native_lang + "?f=" + foreign_lang;
      window.location.href = "video_player.html" + queryString;
    }
  }