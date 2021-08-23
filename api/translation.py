from http.server import BaseHTTPRequestHandler
from textblob import TextBlob

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        path = str(self.path)
        path = path.split("?")
        path = path[1]
        path = path.split("&")
        text = path[0][5:]
        dst = path[1][4:]
        src = path[2][4:]
        text = text.split(",")
        res = ""
        for i in text:
            if(i != ""):
                res += chr(int(i))
        blob = TextBlob(res)
        try:
            blob = blob.translate(from_lang=src, to=dst)
        except:
            try:
                blob = blob.translate(to=dst)
            except:
                blob = ""
        blob = str(blob)
        self.wfile.write(blob.encode())
        return