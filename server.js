const express = require('express');
const fs = require('fs'); 
const app = express();
const PORT = 1521;
const { request } = require('http');

let libros = require('./libros.json');

app.use(express.json());

app.get('/', (request, response) => {
    response.send('Bienvenido a la API de libros. Accede a /api/libros para ver la lista de libros.');
});

app.get('/api/libros', (request, response) => {
    try {
        response.status(200).json(libros);
    } catch (error) {
        console.error(error);
        response.status(500).json({
            "message": "Contacte a soporte"
        });
    }
});

app.post('/api/libros', (request, response) => {
    const nuevoLibro = request.body; 

    if (!nuevoLibro.id || !nuevoLibro.titulo || !nuevoLibro.autor || !nuevoLibro.ano || !nuevoLibro.genero) {
        return response.status(422).json({
            message: "Datos del libro incompletos o incorrectos. Deben incluir id, titulo, autor, año y genero"
        });
    }
    
    libros.push(nuevoLibro);
    guardarLibros(libros);
    response.status(201).json(nuevoLibro); 
});

app.put('/api/libros/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const datosActualizados = request.body;

    if (!datosActualizados.id || !datosActualizados.titulo || !datosActualizados.autor || !datosActualizados.ano || !datosActualizados.genero) {
        return response.status(422).json({
            message: "Datos del libro incompletos o incorrectos. Deben incluir id, titulo, autor, año y genero"
        });
    }

    const indice = libros.findIndex(libro => libro.id === id);

    if (indice !== -1) {
        libros[indice] = { ...libros[indice], ...datosActualizados };
        guardarLibros(libros);
        response.status(200).json(libros[indice]);
    } 
    else {
        response.status(404).json({ mensaje: 'Libro no encontrado' });
    }
});


app.patch('/api/libros/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const datosParciales = request.body;

    if (!datosParciales.id || !datosParciales.titulo || !datosParciales.autor || !datosParciales.ano || !datosParciales.genero) {
        return response.status(422).json({
            message: "Datos del libro incompletos o incorrectos. Deben incluir id, titulo, autor, año y genero"
        });
    }

    const libroActualizado = actualizarLibro(id, datosParciales);

    if (!libroActualizado) {
        return response.status(404).json({
            message: 'Libro no encontrado',
            detalles: id
        });
    }

    return response.status(200).json({
        message: 'Libro actualizado exitosamente',
        libro: libroActualizado
    });
});

function actualizarLibro(id, datos) {
    const libro = {
        id: id,
        titulo: 'Ejemplo de Título',
        autor: 'Autor Ejemplo',
        ano: 2023,
        genero: 'Ficción'
    };

    for (const campo in datos) {
        if (libro.hasOwnProperty(campo)) {
            libro[campo] = datos[campo];
        }
    }

    return libro;
}


app.delete('/api/libros/:id', (request, response) => {
    const id = parseInt(request.params.id);
    
    const indice = libros.findIndex(libro => libro.id === id);

    if (indice !== -1) {
        const libroEliminado = libros.splice(indice, 1)[0];
        guardarLibros(libros);
        
        response.status(200).json({
            mensaje: 'Libro eliminado',
            libro: libroEliminado
        });
    } else {
        response.status(404).json({ mensaje: 'Libro no encontrado' });
    }
});


function guardarLibros(libros) {
    fs.writeFileSync('./libros.json', JSON.stringify(libros, null, 2));
}
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
