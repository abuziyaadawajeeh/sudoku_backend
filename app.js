const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const object = require("./initialarray");

console.log(object.initialarray[1][1][2])


io.on("connect", (socket) =>{
    console.log("socket id" + socket.id);
    socket.on("inputnum", inputnum => {
        const issuccess = dotask(inputnum, socket.id);
        if(issuccess)
            io.emit("inputnumchanged", object)
    })
    socket.on("highlightchange", cellid => {
        console.log(cellid);
        io.emit("highlightchanged", cellid)
    })

    socket.on("initiateme", () => {
        var initialobj = {  ...object , clientid : socket.id}
        socket.emit("getinitiated", initialobj); 
    })
    socket.on("givenumbers", () => {
        socket.emit("havenumbers", object)
    })

    socket.on("highlightcell", (cellid) => {
        object.highlightedcell = object.highlightedcell.filter(e => {
            return e.clientid != socket.id
        }) //remove previous highlighted cell of that client
        object.highlightedcell.push({cellid: cellid, clientid: socket.id}); //add new highlighted cell
        console.log("emitting havenumbers")
        io.emit("havenumbers", object);

    })
    socket.on("disconnect" , () => {
         object.highlightedcell = object.highlightedcell.filter(e => {
            return e.clientid != socket.id
        })
        io.emit("havenumbers", object);
        console.log("a client disconnected id" + socket.id);
    })
        
        

});




server.listen(3001, () => console.log("listening on port 3001"));


var flag = 0;

function dotask(inputnum, socketid){
    var cellid = null;
    object.highlightedcell.forEach(e => {
        if(e.clientid == socketid)  
            cellid = e.cellid;
    })
    if(!cellid)
        return null; //no cell was selected
    console.log(cellid);
    const i= Math.floor(cellid/10) -1 , j= cellid%10 -1;
    object.initialarray[i][j][2] = inputnum;
    const correctvalue = object.initialarray[i][j][0];

    
    if(inputnum == correctvalue && flag == 0){
        object.correctcount++
        flag = 1;
    }
    else if(flag && inputnum != correctvalue){
        object.correctcount--
        flag = 0
    }
    if(object.correctcount == object.requiredcorrect)
        object.issolved = 1;
        
    return 1;
}