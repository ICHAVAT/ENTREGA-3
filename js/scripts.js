
const usuarios = [{
    nombre: 'Ivan',
    mail: '1',
    pass: '1',
},
{
    nombre: 'milo',
    mail: 'milo@mail.com',
    pass: 'milo1234'
},
{
    nombre: 'reteri',
    mail: 'reteri@mail.com',
    pass: 'reteri1234'
}]


//DOM
//login
const mailLogin = document.getElementById("email"),
    passLogin = document.getElementById("contraseña"),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    errorlog = document.getElementById("errorlog"),
    //registro
    regisNombre = document.getElementById("nombre"),
    regisMail = document.getElementById("emailRegistro"),
    regiscontra = document.getElementById("contraseñaRegistro"),
    registro = document.getElementById("Registrarse"),
    parrafo = document.getElementById("error"),
    registrolav = document.getElementById("registro"),
    modal2 = new bootstrap.Modal(registrolav),
    //carro
    btnLogout = document.getElementById("btnLogout"),
    modalEl = document.getElementById('exampleModal'),
    modal = new bootstrap.Modal(modalEl),
    toggles = document.querySelectorAll('.toggles'),
    contenedorModa = document.getElementById("modal-carro"),
    precioTotal = document.getElementById("precioTotal"),
    vaciar = document.getElementById("vaciarCarrito"),
    comprar = document.getElementById("confirmarCompra"),

    contenedorCarrito = document.getElementById("botoncarrito"),
    contadorCarrito = document.getElementById("contadorca"),
    cantidad = document.getElementById('cantidad'),
    carritomodal = document.getElementById("staticBackdrop"),
    modal3 = new bootstrap.Modal(carritomodal),
    contenedorProductos = document.getElementById("tarjeta");

let carrito = [];


document.addEventListener('DOMContentLoaded', () => {
    sesionCerrada();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

//cierre de session automatico 
const sesionCerrada = () => {
    if (recuperarUsuario(localStorage)) {
        setTimeout(() => {
            clearTimeout()
            Swal.fire({
                title: 'Cierre Session automatico',
                text: '¿quiere mantener su session abierta?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, mantener session abierta',
                cancelButtonText: 'Cerrar session',
                backdrop: '#66f4ae50'
            })
                .then((result) => {
                    if (!result.isConfirmed) {
                        borrarDatos();
                        presentarInfo(toggles, 'd-none');

                    }
                })

        }, 100000);
    }
}

registro.addEventListener('click', (e) => {
    e.preventDefault();
    parrafo.innerHTML = "";
    if (regiscontra.value.length < 8) {
        parrafo.innerHTML += `la contraseña es debe tener almenos 8 caracteres  <br>`
    } else {
        {
            let item = {
                nombre: regisNombre.value,
                mail: regisMail.value,
                pass: regiscontra.value
            }
            usuarios.push(item);

            Swal.fire({
                title: 'Registro',
                text: 'El usuario fue creado correctamente',
                icon: 'success',
                backdrop: '#66f4ae50'
            })
            modal2.hide();
        }
    }



});

// agregando al html si se quiere añadir un producto, solo hace falta poner las caracteristicas, y agregando al contador numerico del carrito 

const fetchData = async () => {

    try {
        const res = await fetch('./js/productos.json')
        const data = await res.json()
        productos = data;

        productos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('row-gx-4-gx-lg-5-row-cols-2-row-cols-md-3-row-cols-xl-4-justify-content-center')
            div.classList.add('col-mb-5');
            div.innerHTML = `<div class="card h-100">
    <!-- Product image-->
    <img class="card-img-top" src="${producto.img}" alt="..." />
    <!-- Product details-->
    <div class="card-body p-4">
        <div class="text-center">
            <!-- Product name-->
            <h5 class="fw-bolder">${producto.marca}</h5>
            <h5 class="fw-bolder-primary">${producto.modelo}</h5>
            <!--Estrella-->
            <div class="d-flex justify-content-center small text-warning mb-2">
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
                <div class="bi-star-fill"></div>
            </div>
            <!-- Product price-->
            <div>$${producto.precio}</div>

        </div>
    </div>
    <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center"><a class="btn btn-outline-dark mt-auto" id="agregar${producto.id}">agregar al
                carrito</a></div>
    </div>
</div>`

            contenedorProductos.appendChild(div)

            const boton = document.getElementById(`agregar${producto.id}`)
            boton.addEventListener('click', () => {
                agregarCarrito(producto.id);
                Toastify({
                    text: "El producto fue agregado al carrito",
                    duration: 2000,
                    stopOnFocus: false,
                    close: true,
                    style: {
                        color: "white",
                        width: "20vw",
                        height: 20,
                        background: "#68ca84"
                    }
                }).showToast();

            })


        })
    }
    catch {
        alert("error al obtener los datos ")
    }

}

fetchData();


// agregando al carrito los productos seleccionados y aumentamos la cantidad para que no se repitan con el some
const agregarCarrito = (prodId) => {
    const existe = carrito.some(prod => prod.id === prodId)
    if (existe) {
        const prod = carrito.map(prod => {
            if (prod.id === prodId) {
                prod.cantidad++
            }
        })
    } else {
        const item = productos.find((prod) => prod.id === prodId)
        carrito.push(item)
    }

    actualizarCarrito()
}

//eliminar del carrito
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)
    let indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    actualizarCarrito();
}

//vaciar carrito
vaciar.addEventListener("click", () => {
    carrito.length = 0
    actualizarCarrito();
})


// agregando al carrito los productos seleccionados
const actualizarCarrito = () => {
    contenedorModa.innerHTML = ""

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.marca}</p>
        <p>${prod.modelo}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="bi bi-trash"></i></button>
        `

        contenedorModa.appendChild(div)

        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    contadorCarrito.innerText = carrito.length  //contador numerico del carrito 
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio, 0)
}


function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);
    if (typeof encontrado === 'undefined') {
        return false;
    } else {
        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}

function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass
    }

    storage.setItem('usuario', JSON.stringify(usuario));
}

function estaLogueado(usuario) {

    if (usuario) {
        presentarInfo(toggles, 'd-none');
    }
}


function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}

function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    errorlog.innerHTML = ""
    if (!mailLogin.value || !passLogin.value) {
        errorlog.innerHTML += `todos los campos son requeridos<br>`
    } else {
        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value)
        if (!data) {
            errorlog.innerHTML += `la contraseña o el usuario es incorrecto  <br>`
        } else {

            if (recordar.checked) {
                guardarDatos(data, localStorage);
                guardarDatos(data, sessionStorage);
            } else {
                guardarDatos(data, sessionStorage);
            }
            sesionCerrada();
            modal.hide();
            presentarInfo(toggles, 'd-none');
        }
    }
});

btnLogout.addEventListener('click', () => {


    Swal.fire({
        title: 'Cerrar session',
        text: '¿estas seguro que quires cerrar session?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        backdrop: '#66f4ae50'
    })
        .then((result) => {
            if (result.isConfirmed) {

                presentarInfo(toggles, 'd-none');
                borrarDatos();
            }
        })
}
)

comprar.addEventListener("click", () => {
    carrito.length >= 1 ? Swal.fire({   // OPERADOR TERNARIO
        title: '¡Su compra se a realizado con exito!',
        text: 'le llegara un mail con la factura correspondiente',
        icon: 'success',
        backdrop: '#66f4ae50'
    }) :Toastify({
        text: "No tienes ningun producto en el carrito",
        duration: 2000,
        stopOnFocus: false,
        close: true,
        style: {
            color: "white",
            width: "20vw",
            height: 20,
            background: "red"
        }
    }).showToast();
    carrito.length = 0
    actualizarCarrito();

})




window.onload = () => estaLogueado(recuperarUsuario(localStorage))










