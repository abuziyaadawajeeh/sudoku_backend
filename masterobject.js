const oneobject = require("./initialarray.js");


module.exports = {
    gameon : 0,
    timeron : 0,
    allarrays : {

    },
    allplayers : {

    },
    set addplayer(details) {
        this.allarrays[details.socketid] = oneobject
        this.allplayers[details.socketid] = {
            name : details.name
        }
    },
    set removeplayer(socketid){
        delete this.allarrays[socketid]
        delete this.allplayers[socketid]
        const keys = Object.keys(this.allarrays)
        if(keys.length == 0){ //reset those two flags if the last player went offline
            this.timeron = 0
            this.gameon = 0
        }
    },
    set starttimer(dummy){
        this.timeron = 1
    },
    set startgame(dummy){
        this.gameon = 1
    }
}