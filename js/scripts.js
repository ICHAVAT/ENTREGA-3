
const usuarios = [{
    nombre: 'Ivan',
    mail: 'ivan@mail.com',
    pass: 'ivan123'
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

const relojes = [{
    id: "1",
    marca: "samsung",
    modelo: "k23",
    precio: 1800,
    img: "./css/rose.png"
}, {
    id: "2",
    marca: "samsung",
    modelo: "w88",
    precio: 2999,
    img: "./css/SMARTWATCH.png"
}, {
    id: "3",
    marca: "alcatel",
    modelo: "rr99",
    precio: 999,
    img: "./css/greysasa.jpg"
}, {
    id: "4",
    marca: "smartwatch",
    modelo: "sol33",
    precio: 4999,
    img: "./css/blackarco.jpg"
}
]

//DOM

const mailLogin = document.getElementById("email"),
    passLogin = document.getElementById("contraseña"),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    btnLogout = document.getElementById("btnLogout"),
    modalEl = document.getElementById('exampleModal'),
    modal = new bootstrap.Modal(modalEl),
    toggles = document.querySelectorAll('.toggles'),
    contenedorCarrito = document.getElementById("botoncarrito"),
    contadorCarrito = document.getElementById("contadorca"),
    contenedorProductos = document.getElementById("tarjeta");




let carrito = [];



// agregando al html si se quiere añadir un producto, solo hace falta poner las caracteristicas, y agregando al contador numerico del carrito 
relojes.forEach(producto => {
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
        contadorCarrito.innerText = carrito.length
    })

    
})


// agregando al carrito los productos seleccionados
const agregarCarrito = (prodId) => {
    const item = relojes.find((prod) => prod.id === prodId)
    carrito.push(item);
    console.log(carrito);
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
    if (!mailLogin.value || !passLogin.value) {
        alert('Todos los campos son requeridos');
    } else {
        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value)
        if (!data) {
            alert(`Usuario y/o contraseña erróneos`);
        } else {

            if (recordar.checked) {
                guardarDatos(data, localStorage);
                guardarDatos(data, sessionStorage);
            } else {
                guardarDatos(data, sessionStorage);
            }
            modal.hide();
            presentarInfo(toggles, 'd-none');
        }
    }
});

btnLogout.addEventListener('click', () => {
    let confirmacion = confirm("¿seguro que quiere cerrar sesion ?")  // confirmacion de querer salir del usuario
    if (confirmacion == true) {
        borrarDatos();
        presentarInfo(toggles, 'd-none');
    }

})

window.onload = () => estaLogueado(recuperarUsuario(localStorage)) 
















