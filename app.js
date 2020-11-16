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
const gameplay = io.of("/gameplay")
gameplay.on("connect", (socket) =>{
    console.log("normal connection id" + socket.id);
    socket.on("inputnum", inputnum => {
        console.log("input num event");
        const cellid = findcellid(socket.id);
        if(cellid){
            object.initialarray[cellid.i][cellid.j][2] = inputnum;
            gameplay.emit("inputnumchanged", object)
        }
    })
    socket.on("check", inputnum => {
        const cellid = findcellid(socket.id)
        if(cellid){
            dochecking(inputnum, cellid)
        }
    })

    socket.on("initiateme", () => {
        var initialobj = {  ...object , clientid : socket.id}
        console.log("emitting get initiated")
        socket.emit("getinitiated", initialobj); 
    })
    socket.on("givenumbers", () => {
        socket.emit("havenumbers", object)
    })

    socket.on("cellhighlight", (cellid) => {
        object.highlightedcell = object.highlightedcell.filter(e => {
            return e.clientid != socket.id
        }) //remove previous highlighted cell of that client
        object.highlightedcell.push({cellid: cellid, clientid: socket.id}); //add new highlighted cell
        console.log("emitting havenumbers")
        gameplay.emit("havenumbers", object);

    })
    socket.on("disconnect" , () => {
         object.highlightedcell = object.highlightedcell.filter(e => {
            return e.clientid != socket.id
        })
        gameplay.emit("havenumbers", object);
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
    gameplay.emit("mistakes", mistakes);
    mistakes = []
    count = 0;
}

app.get("/", (req,res) => {
    res.send("Server working")
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 // Add this
 if (req.method === 'OPTIONS') {

      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }

  next();

});

const online = io.of("/online");
const single = io.of("/single")
const dual = io.of("/dual")

var onlineusers = {}

online.on("connection", socket => {
    console.log("Some user is online")
    socket.emit("onlineusers", onlineusers)
    socket.on("message" , name => {
        socket.send(`Your name is ${name}`)
    })

    socket.on("entername", name => {
        onlineusers = {...onlineusers, [socket.id] : name}
        online.emit("onlineusers", onlineusers)
    })

    socket.on("disconnect", () => {
        onlineusers = {...onlineusers, [socket.id] : null }
        online.emit("onlineusers", onlineusers)
    })

})




single.on("connection", socket => {
    socket.send("this is single player mode");
} )

dual.on("connection", socket => {
    socket.send("this is dual player mode");
})
