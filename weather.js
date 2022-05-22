var requests = require("requests");
const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 2500;

const indexfile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req, res) => {
    if (req.url = "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Bijnor&appid=2b29931eb3e722a8c2dcac378030b24f",
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(indexfile, val)).join("");
                res.write(realTimeData);
                // console.log(val.main);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    }
});

server.listen(port, "127.0.0.1");