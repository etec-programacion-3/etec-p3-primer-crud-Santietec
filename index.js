/**
 * Importaciones de Express, Body Parser y Sequelize.
 */
import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

// Inicialización de la aplicación Express.
const app = express();

// Puerto en el que se ejecutará el servidor.
const port = 3000;

// Nombre del archivo de base de datos SQLite.
const filename = "database.db";
console.log(filename);

// Configuración de Sequelize para la conexión a la base de datos SQLite.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

// Definición del modelo Book utilizando Sequelize.
class Book extends Model { }
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER,
}, { sequelize, modelName: 'book' });

// Sincronización del modelo con la base de datos.
sequelize.sync();

// Configuración del middleware Body Parser para parsear URL y JSON.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Manejadores de rutas para la API RESTful de libros.

/**
 * Maneja peticiones GET para obtener todos los libros.
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Maneja peticiones GET para obtener un libro por su ID.
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Maneja peticiones POST para crear un nuevo libro.
 * @param {import('express').Request} req - Objeto de solicitud con los datos del libro.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Maneja peticiones PUT para actualizar un libro existente por su ID.
 * @param {import('express').Request} req - Objeto de solicitud con los datos actualizados del libro.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Maneja peticiones DELETE para eliminar un libro por su ID.
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Inicia el servidor en el puerto especificado.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
