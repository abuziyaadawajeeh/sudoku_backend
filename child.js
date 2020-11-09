
var object;
var allmistakes = [0,0,0,0,0,0,0,0,0]
allmistakes = allmistakes.map(e => {
    return []
})

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
        process.send({type : "result", result : result})
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
        mistakes = storemistakes(i, mistakes)
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
        mistakes = storemistakes(j,mistakes)
        if(mistakes.length == 0 && isfull)
            isclear = 1;
        return {mistakes : mistakes, isclear : isclear} 
    }
    if(pid == 2){
        var mistakes = []
        var r= i - ((i+3)%3), c = j - ((j+3)%3)
        var isfull = 1;
        for(var k=r;k<r+3;k++)
           for(var l=c;l<c+3;l++){
               const ref = object.initialarray[k][l][2];
               if(ref == 0)
                  isfull = 0;
               var count = 0
               for(var m=r;m<r+3;m++)
                   for(var n=c;n<c+3;n++){
                       if(object.initialarray[m][n][2] == ref && ref != 0)
                          count++;
                   }

                if(count > 1)
                    mistakes.push((k+1)*10 + l+1)
           }
        mistakes = storemistakes(findsquare(k,l), mistakes)
        if(mistakes.length == 0 && isfull)
            isclear = 1;
        
        return {mistakes : mistakes, isclear : isclear} 
        

    }
}

function storemistakes(i, onecollection){
    allmistakes[i] = onecollection;
    var newarray = []
    for(var k=0;k<9;k++){
        newarray = newarray.concat(allmistakes[k])
    }
    console.log(newarray)
    return newarray

}

function findsquare(k,l){
    var index;
    if(k==l){
        if(k==2)
           index = 0;
        else if (k==5)
           index = 4;
        else if(k==8)
            index = 8;
    }
    else if(k>l){
        if(k==5)
           index = 3;
        else if (l==2)
           index = 6;
        else if (l==5)
            index = 7;

    }
    else if(k<l){
        if(k==5)
           index = 5;
        else if (l==5)
           index = 1;
        else if(l==8)
           index = 2
    }
    return index
}