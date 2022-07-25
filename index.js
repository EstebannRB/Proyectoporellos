const express = require('express');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 3000;
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer');
const { send } = require('express/lib/response');
const exp = require('constants');
const res = require('express/lib/response');
const { error } = require('console');
const { allowedNodeEnvironmentFlags } = require('process');

//Conectamos la app a una Base de Datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE
});

//conectamos la BD
const conectar = (conexion.connect((err) => {
    if (err) throw err;
    console.log("Base de Datos Conectada");
})
);


//Configuracion de Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended: false}));

//Configuramos la Vista de la Aplicación
app.set('view engine');
app.set('views', path.join(__dirname, 'views'));

/* app.get('/', (req, res) =>{
    res.send('Nos estamos conectando a una Base de Datos')
}); */

app.get( '/', (req, res) =>{
    res.render('index', {
        titulo: 'Bienvenido a Nuestra app'})
});

app.get('/formulario', (req, res) =>{
    res.render('formulario', {
        titulo: 'Formulario para Completar'})
});

//verbo http para recibir datos
app.post('/formulario', (req, res) =>{
//Desestructuración
    const{ nombre, precio, descripcion } = req.body
    
    console.log(nombre);
    console.log(precio);
    console.log(descripcion);

//Validacion basica

    if(nombre == "" || precio == ""){
    let validacion = "Faltan datos para ingresar el producto"
    res.render('formulario', {
        titulo: "Formulario para completar",
        validacion 
    })
    }else{
    console.log(nombre);
    console.log(precio);
    console.log(descripcion);


    //Conectar()

    let data = {
        Nombre_Producto: nombre,
        Descripcion_producto: descripcion,
        Costo_producto: precio
    }

    let sql = "INSERT INTO PRODUCTOS SET ?";
    
    let query = conexion.query(sql, data, (err, res) =>{
    if(err) throw err;
    res.render('formulario', { 
        titulo : 'Formulario para completar', })
    
    })
    }
    })

    app.get('/productos', (req, res) =>{
    let sql = 'SELECT * FROM PRODUCTOS';
    let query = conexion.query(sql, (err, res)=>{
    
    if(err) throw err
    res.render('productos', {
        titulo: 'Lista de Productos',
        results
        })
    })
});

app.post('/update', (req, res) =>{
    console.log(req.body.Nombre_Producto)
    console.log(req.body.Descripcion_producto)
    console.log(req.body.Costo_producto)

//No olvidar el cambio del nombre de las variables -  formulario
let sql = "UPDATE PRODUCTOS SET Nombre_productos'"+
req.body.Nombre_producto +
"', Costo_productos='" + req.body.Costo_producto
+"'WHERE Nombre_producto"
req.body.nombre
let query = conexion.query(sql, (err, res) =>{
    if(err) throw err
    res.redirect('productos')
    })
})

app.post('/delete', (req, res) =>{
    console.log(req.body.Nombre_producto)
    
    let sql = "DELETE FROM PRODUCTOS WHERE Nombre_producto=" + req.body.Nombre_productos;

    let query = conexion.query(sql, (err, res) =>{
    if(err) throw err
    res.redirect('productos')
    })
})



app.post('/login', (req, res) =>{
    console.log(req.body)
    const{ usuario, password } = req.body
    console.log(usuario);
    console.log(password);
    res.send({respuesta: "tus datos son correctos"})
})

app.get('/login', (req, res) =>{
    console.log(req.body)
    res.render('login',{titulo: 'ingresa tus datos para el login'})
    res.json({respuesta: "tus datos son correctos"})
})

app.get('/productos', (req, res) =>{

    let sql = "SELECT * FROM PRODUCTOS";

    let query = conexion.query(sql, (err, results) =>{
        if (err) throw err;
        res.render('productos', {
            titulo: 'Lista de Productos',
            results
        })
    });    
});


app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Escríbenos'})
});

app.listen(Port, ()=>{
    console.log(`Servidor corriendo en el Puerto ${Port}`);
});

app.on('error', (err) =>{
    console.log(`Tenemos un error ${error}`);
});
