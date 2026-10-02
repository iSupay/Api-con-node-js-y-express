import express from 'express';
import fs from 'fs';

const app = express();

// Middleware para interpretar JSON en las peticiones POST y PUT
app.use(express.json());

// Función para leer los datos del archivo db.json
function readData() {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
}

// Función para escribir datos en el archivo db.json
function writeData(data) {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

// Ruta principal de bienvenida
app.get('/', (req, res) => {
    res.send('Welcome to my First Api with Node.js');
});

// GET: Obtener todos los libros
app.get('/books', (req, res) => {
    const data = readData();
    res.json(data.Books);
});

// GET: Obtener un libro por su ID
app.get('/books/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.Books.find((book) => book.id === id);
    res.json(book);
});

// POST: Crear un nuevo libro
app.post('/books', (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.Books.length + 1,
        ...body,
    };
    data.Books.push(newBook);
    writeData(data);
    res.json(newBook);
});

// PUT: Actualizar un libro existente
app.put('/books/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;
    const bookIndex = data.Books.findIndex((book) => book.id === id);

    data.Books[bookIndex] = {
        ...data.Books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: 'Book updated successfully' });
});

// DELETE: Eliminar un libro
app.delete('/books/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.Books.findIndex((book) => book.id === id);

    data.Books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: 'Book deleted successfully' });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});