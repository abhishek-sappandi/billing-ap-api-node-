function api1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = [ { id: 1, name: 'arjun'}, { id: 2, name: 'karthik' }]
            resolve(data)
            // reject('error')
        }, 1500);
    })
}

function api2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = [{ id: 1, name: 'marker' }, { id: 2, name: 'board' }]
            resolve(data)
        }, 100);
    })
}

Promise.all([api1(), api2()])
    .then((values) => {
        const [users, products ] = values 
        console.log('users', users)
        console.log('products', products)
    })
    .catch((err) => {
        console.log(err)
    })

// api1()
//     .then((data) => {
//         console.log(data)
//     })

// api2()
//     .then((data) => {
//         console.log(data)
//     })