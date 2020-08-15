// #1 create promise object
const myPromise = new Promise(function(resolve, reject){
    console.log(resolve,reject)
    setTimeout(()=>{
        const random = Math.round(Math.random() * 10)
        if(random % 2 == 0){
            resolve(random)
        }else {
            reject(random)
        }
    }, 1500)
})

// #2 consume the promise object
// state - pending
myPromise
    .then((n)=>{
        console.log('even',n)
    })
    .catch((n)=>{
        console.log('odd',n);
    })