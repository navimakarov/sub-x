const request = require("request");
const cheerio = require("cheerio");

module.exports = (req, response) => {
    const { word, src, dst } = req.query;
    var url = "https://glosbe.com/" + src + "/" + dst + "/" + word;
    request(url, function (error, res, html) {
        if(!error){
            var meanings = "";
            const $ = cheerio.load(html);
            $('.text-info').each(function(i, elem) {
    	        meainigs += $(this).children().first().text();
            });
            translations.shift();
            for(var i = 0; i < translations.length; i++) {
                meanings += translations[i];
                meanings += ",";
            }
            response.send(meanings);
        }
        else{
            response.send("");
        }
    });
};