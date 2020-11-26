const object = require("./generator.js");

var newobj
function generatenew(){
    newobj = new object
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
        this.allarrays[details.socketid] = newobj
        this.allplayers[details.socketid] = {
            name : details.name,
            filledcount : 0,    
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
            // notify.notifywaiters()
        }
    },
    set starttimer(dummy){
        this.timeron = 1
        generatenew()
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

