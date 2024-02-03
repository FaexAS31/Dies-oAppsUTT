const axios = require('axios')

const url = "https://jsonplaceholder.typicode.com/users";

// axios.get(url).then(({data}) =>{
//     data.forEach(element => {
//         console.log(element.username)
//     });
// })

axios.post(url, {
    username: "Foo",
    mail : "foo@foo.com"
}).then(response => {
    if(response.status === 201){/
        console.log("El registro fue guardado de forma correcta")
    }
})