const dbname = "twitter";
const measure = "tweets";
const Influx = require("influx");
const influx = new Influx.InfluxDB({
 host: "localhost",
 database: dbname,
 schema: [
   {
     measurement: measure,
     fields: {
       tweetid: Influx.FieldType.INTEGER,
       polarity: Influx.FieldType.FLOAT,
       user: Influx.FieldType.STRING,
       raw: Influx.FieldType.STRING
     },
     tags: [
       "keywords"
     ]
   }
 ]
});
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(dbname)) {
      return influx.createDatabase(dbname);
    }
  });

// after processing, save Tweet result to InfluxDB directly
function saveTweetToInflux(result) {
  influx.writePoints([
    {
      measurement: "tweets",
      tags: {                        // array of matched keywords
        keywords: ["test"]
      },
      fields: {
        tweetid: result.tweetid,     // unique tweet id
        polarity: result.polarity, // 0.0 to 1.0 for later analysis
        user: result.user,           // original twitter user
        raw: JSON.stringify(result)  // complete tweet for later analysis
      },
	  timestamp: result.timestamp
    }
  ]).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`);
  });
}

var express = require('express');

var app = express();

app.use(express.json());

app.post('/', function(request, response){
	console.log(request.body);      // your JSON
	saveTweetToInflux(request.body);
	response.end("{}")
});

app.listen(8099);
