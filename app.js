const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);


app.get("/",(req,res)=>{
    res.send("this is the bakcend");
})

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

});


server.listen(3001, () => console.log("listening on port 3001"));