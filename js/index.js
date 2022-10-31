let containerProducts_NewArrival = document.getElementById("containerProducts_NewArrival");
let productsList = []
let basket = [];

function generateShop() {
    containerProducts_NewArrival.innerHTML = "";
        for (let product of productsList) {
            let column = document.createElement("div");
                column.className = "col-sm-6 col-md-4 col-lg-4 mw-100 mh-100 d-flex pb-2";
                column.id = `columna-${product.id}`;
                column.innerHTML = `
                    <div class="card">
                        <img class="card-img-top resizeCard_img" src="img/${product.imagen}" alt="Card image cap">
                        <div class="card-body">
                            <p class="card-text">Nombre: <b>${product.name}</b></p>
                            <p class="card-text">Formato: <b>${product.type}</b></p>
                            <p class="card-text">Precio en dolares: <b>${product.price}</b></p>
                            <p class="card-text" id="cant-${product.id}">stock: <b>${product.stock}</b></p>
                        </div>
                        <div class="card-footer">
                            <button onclick="basketEvent(select)" class="btn btn-primary" id="${product.id}">Agregar</button>
                        </div>
                    </div>`;
                    containerProducts_NewArrival.append(column);
        }
}

function basketEvent(select){
    select = parseInt(select);
    productsList.map(function(y){
        if(y.id == select){
            if (y.stock > 0){
                let product = productsList.find(amount => amount.id == select);
                let same = basket.find((x)=> x.id === product.id);
                if (same === undefined){
                    basket.push({   
                        id: product.id,
                        imagen: product.imagen,
                        name: product.name,
                        type: product.type,
                        price: product.price,
                        stock: 1,});
                    }else{
                        same.stock += 1;
                    }
                    y.stock -= 1;
                    updateStorage();
                    positiveToast();
                }else{
                    showSwal();
                    negativeToast();
            }
        }
    });
    updateCounter(basket);
    generateShop();
}



function positiveToast() {
    Toastify({
        text: "Item se añadio al carrito con exito!",
        duration: 1800,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function negativeToast() {
    Toastify({
        text: "Hubo un error al cargar el item al carrito",
        duration: 1800,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "red",
        },
    }).showToast();
}

function showSwal() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nos quedamos sin stock!',
      })
}

function updateCounter(cartNumber){
    let total = 0;
    for (let y of cartNumber) {
        total += y.stock;
    }
    cartAmount.innerHTML = total;
}

function triggerEvent() {
    containerProducts_NewArrival.onclick = (event) => basketEvent(event.target.id);
}

function getItemStorage() {
    let productosJSON = localStorage.getItem("basket");
    if (productosJSON) {
        basket = JSON.parse(productosJSON);
        updateCounter(basket);
    }
}

function updateStorage() {
    let productosJSON = JSON.stringify(basket);
    localStorage.setItem("basket", productosJSON);
}

async function callingProductsServer () {
    try {
        /* const response = await fetch("https://63472f9b0484786c6e7ca19b.mockapi.io/Products") */
        const response = await fetch("./data.json");
        const data = await response.json();
        productsList = [...data];
        console.log(data);
        generateShop();
    } catch (error) {
        console.log(error);
    }
}

function main() {
    callingProductsServer ();
    triggerEvent();
    basketEvent();
    getItemStorage();
}

main();