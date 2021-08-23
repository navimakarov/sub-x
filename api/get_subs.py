from http.server import BaseHTTPRequestHandler
from youtube_transcript_api import YouTubeTranscriptApi
import json

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        path = str(self.path)
        path = path.split("?")
        path = path[1]
        path = path.split("&")
        language = path[0][5:]
        id = path[1][3:]
        subs = []
        try:
            subs = YouTubeTranscriptApi.get_transcript(id, languages=[language])
        except:
            list_of_subs = YouTubeTranscriptApi.list_transcripts(id)
            for lang in list_of_subs:
                lang_def = str(lang).split(" ")[0]
                if language in lang_def:
                    language = lang_def
                    break
            subs = YouTubeTranscriptApi.get_transcript(id, languages=[language])
        if "ja" in language:
            import tinysegmenter
            segmenter = tinysegmenter.TinySegmenter()
            for i in range (len(subs)):
                words = segmenter.tokenize(subs[i]["text"])
                res = " ".join(words)
                subs[i]["text"] = res
        elif "zh" in language:
            import logging
            logging.disable(logging.DEBUG)
            import jieba
            for i in range (len(subs)):
                words = jieba.cut(subs[i]["text"], cut_all=False)
                res = " ".join(words)
                subs[i]["text"] = res
        self.wfile.write(json.dumps(subs).encode())
        return
