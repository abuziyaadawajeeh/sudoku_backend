
var object;

process.on("message", e => {
    if(e.type === "initiate"){
        console.log(`Child process with id ${process.pid} created`);
        object = e.data;
    }
    if(e.type === "newnum"){
        const {i,j,inputnum, pid} = e.data;
        object.initialarray[i][j][2] = inputnum;
        var result = check(i,j,pid);
        console.log("\n")
        console.log(result.mistakes);
    }
})

function check(i,j,pid){
    if(pid == 0){ //check the corresponding row 
        var mistakes = []
        for(var k=0;k<9;k++){
            const ref = object.initialarray[i][k][2];
            var count = 0;
            for(var l=0;l<9;l++){
                if(object.initialarray[i][l][2] == ref && ref != 0)
                    count++;
            }
            if(count > 1)
                mistakes.push((i+1)*10 + (k+1))
        }
        var isfull = 1, isclear = 0;
        for(var k=0;k<9;k++)
            if(object.initialarray[i][k][2] == 0)
                isfull = 0;
        if(mistakes.length == 0 && isfull)
            isclear = 1;
        return {mistakes : mistakes, isclear : isclear}
    }

    if(pid == 1){ //check the corresponding column 
        var mistakes = []
        for(var k=0;k<9;k++){
            const ref = object.initialarray[k][j][2];
            var count = 0;
            for(var l=0;l<9;l++){
                if(object.initialarray[l][j][2] == ref && ref != 0)
                    count++;
            }
            if(count > 1)
                mistakes.push((k+1)*10 + j+1)
        }
        var isfull = 1, isclear = 0;
        for(var k=0;k<9;k++)
            if(object.initialarray[k][j][2] == 0)
                isfull = 0;
        if(mistakes.length == 0 && isfull)
            isclear = 1;
        return {mistakes : mistakes, isclear : isclear}
    }
}