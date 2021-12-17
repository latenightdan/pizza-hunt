let db;

const request = indexedDB.open('pizza_hunt', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.online) {

        // we haven't created this yet, but we will soon, so let's comment it out for now
        uploadPizza();
    }
};

//this function attempts to submit a new pizza if internet goes down 
function saveRecord(record) {
    //opens new database  with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    //access object stor for new pizzas
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    //add record to your store with add
    pizzaObjectStore.add(record);
}

function uploadPizza() {

    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    const pizzaObjectStore = transaction.objectStore('new_pizza');

                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!')
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

}

request.onerror = function (event) {

    console.log(event.target.errcode);
}

window.addEventListener('online', uploadPizza);