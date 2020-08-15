// #1 create promise object
function determine(n){
    return new Promise(function(resolve,reject){
        setTimeout(()=>{
        if(n % 2 == 0){
            resolve(n)
        }else {
            reject(n)
        }
    }, 2000)
})
}

// #2 consume the promise object
// state - pending
determine(11)
    .then((n)=>{
        console.log('even',n)
    })
    .catch((n)=>{
        console.log('odd',n);
    })