// console.log('hola mundo');

// let x = 89
// var y = 78

// console.log(x+y)

// y = "Foo Bar"

// console.log(y)

// array = [2, "any type works", undefined, null, true, 2.51]
// console.log(array[0] * array[5])

// Sin datos es detectado como un 'set', al agregar un dato con asignacion por ':' es detectado 
// como diccionario
// obj = {
//     keys : values
//     name: "Foo",
//     age: 23,
//     city: "TJ"
// }
// console.log(obj["name"],obj["age"])
// console.log(obj.name,"es de",obj.city)
// console.log(Object.values(obj))

// for(let i=0;i<100; i++){
//     console.log(i)
// }

// for(let index = 0; index < array.lenght;index++){
//     console.log(array[index])
// }

// for (let i of array){
//     console.log(i)
// }
// for(let key of Object.keys(obj)){ // consultar las llaves de un objeto
//     console.log(key + ":"+obj[key])   
// }
// for(let key in obj){
//     console.log(key+":"+obj[key])
// }

// for of para arrays
// for in para objetos

// var i = 1000
// while (i<1000){
//     console.log(i)
//     i+=5
// }

// var k = 1000
// do{
//     console.log(k)
//     i+=5
// }while(i<1000)

// var gatito = "cute"
// if(gatito === "cute"){
//     console.log("This Kitty is pretty cute")
// }else{
//     console.log("This is an Ordinary cat")
// }

// var ternary = (gatito != "cute") ? "This is a truly ugly cat" : "OMG what a beautifulness creation"
// console.log(ternary)

// var opc = 3
// switch(opc){
//     case 1:
//         console.log("I amn The case 1")
//         break;
//     case 2:
//         console.log("I am The case number 2")
//         break;

//     default:
//         console.log("I got no number:c")
//         break;
// }

// function calcularATriangulo(base, altura){
//     var area = base * altura / 2
//     return "El area del triangulo es "+area
// }

// console.log(calcularATriangulo(2,5))

// var msg = "Hello!"
// const bar =(function (msg){
//     console.log("Message: " + msg)}
// )(msg)

// const joe = (function (){
//     return "Hello World!"
// })();
// console.log(joe)

// const foo = function sum (x,y) {
//     return x + y
// }

// console.log(foo(15,29))
// // console.log(sum(12,12)) no se puede invocar directamente a la funcion sum
// var say = function say(times){
//     if(times > 0){
//         console.log("Hello")
//         say(times - 1)
//     }
// }

// var saysay = say;
// say = "Oops!" 
// // saysay(5)
// saysay(5)

// var foo = function() {
//     console.log("Hola mundo")
// } 

// var foo = (msg) => {console.log("Hola mundo" + msg)}

// foo("Como amaneció")
//  function persons(p,...persons){
//     persons.forEach(args => {
//         console.log("P.." + args + ":" + p);
//     });
//  }
//  persons("Hola", "Foo", "Bar", "Joe","Done")




// var url = "https://api.stackexchange.com/2.2/questions?site=stackoverflow&tagged=javascript";

// var responseData = fetch(url).then(response => response.json());
// responseData.then(({items, has_more, quota_max, quota_remaining}) => {
//     for({title, is_answered} of items){
//         console.log("Q: " + title + " -- is_answered: " + is_answered)
//     }
// })

var url = "https://jsonplaceholder.typicode.com/posts";

// fetch(url).then(response => response.json())
// .then(response =>{
//     response.forEach(element => {
//         console.log(element.title);      
//     });
// })

// fetch(url, {
//     method: "POST",
//     headers: {
//         "Content_type": "application/json"
//     },
//     body: JSON.stringify({
//         userId: 1,
//         title: "lorem ipsum etc etc"
//     })
// }).then(response => response.json())
//     .then(response => console.log(response))


var url = "https://jsonplaceholder.typicode.com/users";

fetch(url).then(response => response.json())
.then(response =>{
    response.forEach(element => {
        console.log(element.name + "\n -- Correo:" + element.email+ "\n -- Dirección:" + 
        element.address.street+ ", "
        +element.address.zipcode+"\n -- Ciudad:" + element.address.city+" \n-- Compañía:" +element.company.name +"\n");      
    });
})

// fetch(url, {
//     method: "POST",
//     headers: {
//         "Content_type": "application/json"
//     },
//     body: JSON.stringify({
//         userId: 1,
//         title: "lorem ipsum etc etc"
//     })
// }).then(response => response.json())
//     .then(response => console.log(response))
