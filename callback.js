/*
function - first class citizens

const greet = function (){ 

}

higher order function 
 * a function, takes another function as an argument
 * a function, that returns a function as a value 

callback function
 * a function, that is passed an arg, that gets invoked in the other function

const numbers = [10,20,30,40]

numbers.forEach(function(n){ console.log(n)})

forEach - higher order function
anonymous - callback function

callback functions
    * sync operations
        * forEach
        * find
        * filter
        * map
        * every, some, reduce
        * requestHandlers - app.get('url', (req, res) => { })

    * async operations
        * network requests - api
            - xhr.onload = function(){ }
            - xhr.onerror = function(){ }
        * db operations
        * eventHandler
        

callback - to execute code at a later point in time, code reusablity
*/ 

// callback functions - 2 ways
// 1st style 
const filterEven = function(n) {
    return n % 2 == 0
}

const numbers = [10,11,12,13,14]
const result = numbers.filter(filterEven)
console.log(result)

// 2nd style 
const result2 = numbers.filter(function(n){
    return n % 2 == 0 
})


/*

const listUsers = (req, res) => {
    const users = User.find()
    res.json(users)
}

app.get('/users', listUsers)


const userSuccess = (response) => {
        const users = response.data
        dispatch(users)
    }

const userFailure = (err) => {
        alert(err)
    }

axios.get(api)
    .then((response) => {
        const users = response.data
        dispatch(users)
    })
    .catch((err) => {
        alert(err)
    })

*/