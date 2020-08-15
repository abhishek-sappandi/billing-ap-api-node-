const even = (n) =>{
    console.log('even ' ,n);
    
}
const odd = (n) =>{
    console.log('odd ' ,n);
    
}

function generateRandom(even , odd){
    setTimeout(()=>{
        const random = Math.round(Math.random() * 100)
        if(random % 2 == 0){
            even(random)
        }else {
            odd(random)
        }
    } , 2000)
}

generateRandom(even,odd)