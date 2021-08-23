from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup
import requests as req

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
        text = text.split(",")
        word = ""
        for i in text:
            if(i != ""):
                word += chr(int(i))
        src = path[1][4:]
        dst = path[2][4:]
        res = ""
        query = "https://glosbe.com/"
        query += src
        query += "/"
        query += dst
        query += "/"
        query += word
        resp = req.get(query)

        num_of_meanings = 0

        soup = BeautifulSoup(resp.text, 'lxml')
        for tag in soup.find_all("strong", {"class": "phr"}):
            num_of_meanings += 1
            res += tag.text
            res += ","
            if num_of_meanings == 7:
                break
        self.wfile.write(res.encode())
        return