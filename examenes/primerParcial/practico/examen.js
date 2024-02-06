/* 
    Mendoza Contreras Fabian 
    Grupo: 4B
    Fecha: 03/02/2024
*/

const axios = require("axios");
const url = "https://jsonplaceholder.typicode.com/todos";

console.log("MENU");
console.log("Elegir opción:");
console.log("1.-Lista de todos los pendientes (solo IDs)");
console.log("2.-Lista de todos los pendientes (IDs y Titles)");
console.log("3.-Lista de todos los pendientes sin resolver (ID y Title)");
console.log("4.-Lista de todos los pendientes resueltos (ID y Title)");
console.log("5.-Lista de todos los pendientes (IDs y userID)");
console.log("6.-Lista de todos los pendientes resueltos (ID y userID)");
console.log("7.-Lista de todos los pendientes sin resolver (ID y userID)");
console.log("-+-+-+--+-+-+--+-+-+-+-+-+-+-+-++-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");

var opcion = 1;//Sin el uso de interfaces y sin la implementación de un formulario para el usuario, la solicitud será directamente desde el código.
//Este código se implementaría de modo que en esta variable se capta lo que el usuario pida segun el modelo de la aplicación

switch(opcion){
    case 1://Lista de todos los pendientes (solo IDs)
        console.log("Lista de todos los pendientes (solo IDs)");
        axios.get(url).then(({data}) => {
            data.forEach(element => {
                console.log("ID:" + element.id);
                console.log("");
            })
        });
        break;
    case 2://Lista de todos los pendientes (IDs y Titles)
        axios.get(url).then(({data}) => {
            data.forEach(element => {
                console.log("ID:" + element.id);
                console.log("Title:" + element.title);
                console.log("");
            })
        });
        break;
    case 3://Lista de todos los pendientes sin resolver (ID y Title)
        axios.get(url).then(({data}) => {
                data.forEach(element => {
                    if(! element.completed){
                        console.log("ID:" + element.id);
                        console.log("Title:" + element.title);
                        console.log("");
                    }
                })    
        });
        break;
    case 4://Lista de todos los pendientes resueltos (ID y Title)
        axios.get(url).then(({data}) => {
                data.forEach(element => {
                    if(element.completed){
                        console.log("ID:" + element.id);
                        console.log("Title:" + element.title);
                        console.log("");
                    }
                }) 
        });
        break;
    case 5://Lista de todos los pendientes (IDs y userID)
        axios.get(url).then(({data}) => {
            data.forEach(element => {
                console.log("ID:" + element.id);
                console.log("User ID:" + element.userId);
                console.log("");
            })
        });
        break;
    case 6://Lista de todos los pendientes resueltos (ID y userID)
        axios.get(url).then(({data}) => {
                data.forEach(element => {
                    if(element.completed){
                        console.log("ID:" + element.id);
                        console.log("User ID:" + element.userId);
                        console.log("");    
                    }
                })
                
        });
        break;
    case 7://Lista de todos los pendientes sin resolver (ID y userID)
        axios.get(url).then(({data}) => {
                data.forEach(element => {
                    if(! element.completed){
                        console.log("ID:" + element.id);
                        console.log("User ID:" + element.userId);
                        console.log("");
                    }
                })
        });
        break;
    default:
        console.log("No ha seleccionado ninguna opcion valida");
    break;
};   