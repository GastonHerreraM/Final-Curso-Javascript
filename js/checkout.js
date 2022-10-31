let containerProducts = document.getElementById("containerProducts");
let containerTotal = document.getElementById("containerTotal");
let cartLabel = document.getElementById("cartLabel")
const botonSwal = document.getElementById("btnshowSwal")
let productsList = []
let basket = [];

function generateShop(basket) {
    containerProducts.innerHTML = "";
    for (let product of basket) {
        let column = document.createElement("div");
        column.className = "col-sm-12 col-md-6 col-lg-4 mw-100 mh-100 d-flex pb-2";
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
                            <button onclick="triggerEvent()" class="btn btn-primary" id="${product.id}">Eliminar</button>
                        </div>
                    </div>`;
        containerProducts.append(column);
    }
}

function basketEvent(select) {
    let index = basket.findIndex(x => x.id == select);
    basket.splice(index, 1);
    updateStorage();
    updateCounter(basket);
    generateShop(basket);
}

function updateCounter(productbasket) {
    let total = 0;
    for (const product of productbasket) {
        total += product.stock;
    }
    cartAmount.innerHTML = total
}

function triggerEvent() {
    containerProducts.onclick = (event) => basketEvent(event.target.id);
    location.reload();
}

let totalAmount = () => {
    containerTotal.innerHTML = `
        <h3> Total: $ 0 dolares</h3>
        </br>
        <button onclick="showSwal()" class="checkout btn btn-success">Finalizar</button>
        `
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let { stock, id } = x;
            let search = basket.find((y) => y.id === id) || [];
            return stock * search.price
        }).reduce((x, y) => x + y, 0)
        containerTotal.innerHTML = `
        <h3> Total: $ ${amount} dolares</h3>
        </br>
        <button onclick="showSwal()" class="checkout btn btn-success">Finalizar</button>
        `
        console.log(amount)
    } else {
        containerProducts.innerHTML = `
        <h2 class="my-5 d-flex justify-content-center"> El carrito se encuentra vacio... por el momento.</h2>
        `
        return
    }
}

function showSwal() {
    Swal.fire({
        title: 'Desea efectuar la compra?',
        text: "Esta accion es irreversible",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        denyButtonText: `Cancel`,
    }).then((result) => {
        if (result.isConfirmed && basket.length !== 0) {
            Swal.fire(
                'Compra efectuada',
                'Muchas gracias',
            )
            endingPurchase();
        } else if (result.isDenied) {
            Swal.fire('No se efectuan cambios', '', 'info')
        } else if (basket.length === 0) {
            Swal.fire('El carrito se encuentra vacio', '', 'info')
        }
    })
}

function refresh() {    
    setTimeout(function () {
        location.reload()
    }, 1500);
}

function endingPurchase() {
    localStorage.clear();
    basket.splice(0, basket.lenght);
    updateCounter(basket);
    generateShop(basket);
    refresh();
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

function main() {
    getItemStorage();
    generateShop(basket);
    totalAmount(basket);
}

main();