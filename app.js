const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const object = require("./initialarray");

var {array,  highlightedcell,inputnum ,correctcount,requiredcorrect , issolved} = object;


io.on("connect", (socket) =>{
    console.log("client connected");
    socket.on("inputnumchange", inputnum => {
        console.log(inputnum);
        socket.emit("inputnumchanged", inputnum)
    })
    socket.on("highlightchange", cellid => {
        console.log(cellid);
        socket.broadcast.emit("highlightchanged", cellid)
    })
    socket.on("givenumbers", () => {
        socket.emit("havenumbers", object)
    })

    socket.on("highlightcell", id => {
        object.highlightedcell = id;
        socket.broadcast.emit("havenumbers", object);

    })

});



server.listen(3001, () => console.log("listening on port 3001"));