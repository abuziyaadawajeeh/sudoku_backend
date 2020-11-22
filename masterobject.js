const oneobject = require("./initialarray.js");


module.exports = {
    colors : ["red", "green", "blue", "yellow", "orange", "pink"],
    i : 0,
    gameon : 0,
    timeron : 0,
    allarrays : {

    },
    allplayers : {

    },
    set addplayer(details) {
        this.allarrays[details.socketid] = oneobject
        this.allplayers[details.socketid] = {
            name : details.name,
            correctcount : 0,
            color : this.colors[this.i++]
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
            this.i = 0
        }
    },
    set starttimer(dummy){
        this.timeron = 1
    },
    set startgame(dummy){
        this.gameon = 1
    }
}