const oneobject = require("./initialarray.js");

var fakefinish = {
    "fake1" : {
        name : "fake1",
        timetaken : 50
    },
    "fake2" : {
        name : "fake2",
        timetaken : 40
    },
    "fake3" : {
        name : "fake3",
        timetaken : 45
    },
    "fake4" : {
        name : "fake4",
        timetaken : 37
    },
    "fake5" : {
        name : "fake5",
        timetaken : 63
    },
}


module.exports = {
    colors : ["red", "green", "blue", "yellow", "orange", "pink"],
    i : 0,
    gameon : 0,
    timeron : 0,
    timestarted : null,
    allarrays : {

    },
    allplayers : {

    },
    finishedplayers : {

    },
    set addplayer(details) {
        this.allarrays[details.socketid] = oneobject
        this.allplayers[details.socketid] = {
            name : details.name,
            correctcount : 0,
            color : this.colors[this.i++],
        }
    },
    set removeplayer(socketid){
        delete this.allarrays[socketid]
        delete this.allplayers[socketid]
        this.i--
        const keys = Object.keys(this.allarrays)
        if(keys.length == 0){ //reset those two flags if the last player went offline
            this.timeron = 0
            this.gameon = 0
            this.timestarted = null
            this.i = 0
            this.finishedplayers = {}
        }
    },
    set starttimer(dummy){
        this.timeron = 1
    },
    set startgame(dummy){
        this.gameon = 1
        this.timestarted = Date.now()
    },
    set setfinishdetails(socketid){
        var timetaken = Math.round(((Date.now() - this.timestarted)/1000)*100) / 100
        this.finishedplayers[socketid] = {
            name : this.allplayers[socketid].name,
            timetaken : timetaken
        }
        delete this.allplayers[socketid] 
    }
}