const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

// setup the ability to see into response bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// setup the express assets path
app.use('/', express.static(path.join(__dirname, '../client')))

// API calls ------------------------------------------------------------------------------------
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/home.html'));
})

app.get('/race', async (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/race.html'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// Racers Details
let racersDetails=[{"id":1,"driver_name":"Racer 1","top_speed":650,"acceleration":8,"handling":7},
            {"id":2,"driver_name":"Racer 2","top_speed":600,"acceleration":9,"handling":9},
            {"id":3,"driver_name":"Racer 3","top_speed":500,"acceleration":10,"handling":6},
            {"id":4,"driver_name":"Racer 4","top_speed":550,"acceleration":7,"handling":8},
            {"id":5,"driver_name":"Racer 5","top_speed":700,"acceleration":5,"handling":4}
]


// id, name and segments of track details
let trackDetails=[{"id":1,"name":"Track 1","segments":[87,47,29,31,78,25,80,76,60,14,61,12,29,58,44,81,65,47,86,65,36,68,28,27,7,7,28,60,75,31,78,77,41,39,26,87,61,75,36,43,40,64,63,73,27,88,64,19,3,27,61,9,69,40,25,8,48,43,5,71,60,75,66,46,8,71,62,23,56,73,36,62,68,87,54,37,13,16,80,33,63,7,73,11,79,83,23,71,82,38,76,6,37,0,13,12,63,25,38,75,31,75,17,77,20,10,85,30,82,78,73,31,62,54,67,77,67,21,54,56,82,81,39,76,60,23,76,49,81,72,15,25,80,27,79,8,38,54,33,24,17,22,52,26,59,20,56,71,56,40,61,34,64,65,13,21,30,52,38,67,81,58,24,42,63,42,78,33,88,66,0,35,30,44,22,67,45,21,59,10,63,70,39,50,63,30,84,67,70,5,62,59,60,78,46,35,6,50,56,9,12]},
            {"id":2,"name":"Track 2","segments":[37,86,20,59,72,7,42,28,51,83,48,28,66,79,47,67,12,75,1,23,25,77,33,10,16,16,2,10,50,52,69,11,40,70,29,84,24,60,51,51,77,6,80,29,37,73,51,64,85,89,55,29,74,0,62,70,30,74,13,65,33,41,30,44,49,50,76,8,82,34,15,84,57,24,3,6,68,12,70,12,1,47,1,65,22,49,2,79,21,71,15,51,13,53,66,69,47,68,48,28,83,34,4,85,14,16,67,56,27,24,48,9,66,33,24,77,67,34,9,61,86,73,28,6,16,67,42,66,31,75,22,79,88,37,60,19,48,49,51,22,8,75,11,73,50,30,21,15,26,69,36]},
            {"id":3,"name":"Track 3","segments":[15,10,64,17,47,18,65,3,50,18,21,35,18,4,12,33,12,3,62,13,48,17,46,38,3,11,54,26,60,71,42,57,52,4,43,70,16,17,2,4,31,3,48,46,75,72,45,24,66,69,44,0,34,89,67,64,27,83,14,35,30,59,74,15,9,41,1,1,55,9,43,35,52,22,15,27,42,23,87,79,17,20,65,6,54,24,3,84,12,53,44,40,50,5,44,3,70,29,37,15,61,8,28,84,79,24,41,17,56,60,81,67,31,69,88,80,54,51,70,33,16,76,75,40,72,13,64,29,5,6,81,34,13,86,77,48,83,55,16,19,30,64,70,16,50,81,74,39,26,83,15,1,32,9,74,71,4,81,60,35,88,4,70,6,59,2,36,83,76,62,1,85,17,13,87,88]},
            {"id":4,"name":"Track 4","segments":[9,55,43,70,27,34,22,48,17,37,9,32,6,39,4,56,4,59,73,42,64,29,30,29,23,20,44,75,41,53,21,38,7,84,52,13,11,30,45,10,22,42,71,8,61,57,12,55,66,72,73,75,19,80,84,8,50,57,2,4,40,72,38,16,26,46,35,38,2,63,31,61,3,69,73,30,47,46,51,50,88,75,41,8,68,52,35,85,41,88,66,7,54,79,33,11,51,40,2,44,54,78,3,25,88,50,10,22,60,6,39,30,74,40,61,56,51,82,20,74,83,62,28,7,63,60,13,28,31,6,68,41,27,22,7,37,54,40,77,2,45,15,18,10,84,52,42,25,64,87,83,11]},
            {"id":5,"name":"Track 5","segments":[61,5,30,55,67,19,78,89,35,25,73,10,10,29,3,51,22,28,1,16,49,35,65,11,58,44,83,36,35,50,76,56,3,28,71,22,59,73,43,47,12,53,33,15,0,67,71,11,47,28,67,9,4,6,2,74,58,77,50,2,68,65,57,34,8,38,67,3,34,82,11,61,8,52,68,40,61,1,31,24,17,16,48,74,84,57,58,23,34,25,72,25,59,67,88,62,15,6,48,49,12,81,45,62,74,20,19,33,84,30,60,19,67,25,55,78,53,5,33,1,60,22,52,82,68,34,18,69,38,19,16,36,87,52,88,14,33,36,63,51,3,4,15,30,46,45,83,18,51,31,0,2,18,44,66,82,23,71,25,1,69,28,4,21,23,6,71,46,6,19,56,37,84,37,83,26,41,4,3,29,21,13,74,30,2,41,77,30,47,74,43,47,63]},
            {"id":6,"name":"Track 6","segments":[18,7,4,66,76,15,5,15,15,79,81,53,44,49,17,73,26,10,43,10,67,27,12,54,18,21,85,87,72,73,79,44,44,79,18,72,18,60,40,68,47,15,23,59,15,60,32,1,62,69,86,57,48,56,38,23,8,83,56,53,44,21,43,38,76,24,64,63,30,61,69,22,27,89,9,9,75,33,18,50,37,67,2,82,81,52,68,82,5,48,65,23,48,25,86,41,85,66,11,24,1,89,24,68,62,40,37,1,24,41,83,64,61,23,42,22,78,86,80,80,32,35,19,83,32,81,57,84,62,22,34,33,37,9,75,54,39,79,67,6,20,72,32,0,8,13,19,5,34,12,25,25,24,21,37,76,75,46,13,22,40,45,63,63,77,34,29,50,50,37,72,33,30,43,65,66,63,2,15,82,72,82,39,8,81,47,28,74,16,64,37,85,85,46,56,46,37,32,81,77,36]}]


//API get request for racers
app.get("/api/cars",(request_racer,response_racer)=>{

  return response_racer.send(JSON.stringify(racersDetails));
});           


//API get request for Tracks
app.get("/api/tracks", (request_tracks,response_tracks)=>{

  return response_tracks.send(JSON.stringify(trackDetails));
})




//API Post request
app.post("/api/races", (request_race, response_race) => {

  let races=[]

  let raceId=0

  //Getting required track details by using filter
  let track = trackDetails.filter((filterObj) => filterObj.id === request_race.body.track_id);

  track = (track != null && track.length > 0) ? track[0] : null;

    
  let race = {
    id: raceId,
    track: track.name,
    player_id: request_race.body.player_id,
    cars: [],
    result: [],
    status: "unstarted",
  };

  raceId += 1;

  races.push(race);
  
  return response_race.send(JSON.stringify(race));
});
  
  //Race information fatching
app.get("/api/races/:id", (request_race, response_race) => {
  let raceInfo = {

    ...races[0],
    positions: [{ car: "", final_position: 3, speed: 100, segment: 2 }],
  };
  
  return response_race.send(JSON.stringify(raceInfo));
});

  
  //Starting the race.................................
app.post("/api/races/:id/start", (request_race, response_race) => {
    
  let raceId = parseInt(request_race.params.id);

  let race = races.filter((raceObj) => raceObj.id === raceId);

  race = (race != null && race.length > 0) ? race[0] : null;

  if (race) {
    race.status = "in-progress";
  }
  
  return response_race.end();
});
  
  
app.post("/api/races/:id/accelerate", (request_race, response_race) => {

    
  return response_race.end();
});
  

app.post("/api/races/:id/start", (request_race, response_race) => {

  let raceId = request_race.params.id;

  let race = races.filter((raceObj) => raceObj.id === raceId);

  race = (race != null && race.length > 0) ? race[0] : null;
  
  return response_race.end();
});