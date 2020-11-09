const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const object = require("./initialarray");
const children = require("child_process")

var mistakes = [], count = 0;

var allchild = [];
for(var i=0;i<3;i++){
    allchild.push(children.fork("./child.js"));
    allchild[i].send({type : "initiate", data: object});
    allchild[i].on("message", data => {
        if(data.type === "result"){
            mistakes = mistakes.concat(data.result.mistakes)
            count++
            if(count > 2)
               takecare();
        }
    })
} //spawn three child processes when the server starts



var i=0
io.on("connect", (socket) =>{
    console.log("socket id" + socket.id);
    socket.on("inputnum", inputnum => {
        const cellid = findcellid(socket.id);
        if(cellid){
            object.initialarray[cellid.i][cellid.j][2] = inputnum;
            io.emit("inputnumchanged", object)
        }
    })
    socket.on("check", inputnum => {
        const cellid = findcellid(socket.id)
        if(cellid){
            dochecking(inputnum, cellid)
        }
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



const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log("listening on port 3001"));



function findcellid(socketid){
    var cellid = null;
    object.highlightedcell.forEach(e => {
        if(e.clientid == socketid)  
            cellid = e.cellid;
    })
    if(!cellid)
        return null; //no cell was selected
    const i= Math.floor(cellid/10) -1 , j= cellid%10 -1;
    return {i:i, j:j}
        
}

function dochecking(inputnum, cellid){
    for(var k=0;k<3;k++){
        allchild[i].send({
            type : "newnum",
            data : {
                inputnum : inputnum,
                i: cellid.i, 
                j :cellid.j,
                pid : k
            }
        })
    }
}

function takecare(){
    io.emit("mistakes", mistakes);
    mistakes = []
    count = 0;
}