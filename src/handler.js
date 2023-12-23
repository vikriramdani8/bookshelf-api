const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const pageValidate = pageCount >= readPage;

    if (!!name && pageValidate) {
        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt,
        };

        books.push(newBook);
        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            const response = res.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);

            return response;
        }
    }

    let errMsg = '';
    if (!name) errMsg = 'Mohon isi nama buku';
    else if (!pageValidate) errMsg = 'readPage tidak boleh lebih besar dari pageCount';
    else errMsg = 'Mohon isi nama buku';

    const response = res.response({
        status: 'fail',
        message: `Gagal menambahkan buku. ${errMsg}`,
    });

    response.code(400);
    return response;
};

const getAllBooks = (req) => {
    const { reading, finished, name } = req.query;

    const filterBook = books.filter((p) => {
        if (reading) return p.reading === !!+reading;

        if (finished) return p.finished === !!+finished;

        if (name) return p.name.toLowerCase().includes(name.toLowerCase());

        return p;
    });

    const allBooks = filterBook.map((book) => {
        const { id, publisher } = book;
        return { id, name: book.name, publisher };
    });

    return {
        status: 'success',
        data: {
            books: allBooks,
        },
    };
};

const getBookById = (req, res) => {
    const { id } = req.params;
    const bookIndex = books.findIndex((p) => p.id === id);

    if (bookIndex !== -1) {
        return {
            status: 'success',
            data: {
                book: {
                    ...books[bookIndex],
                },
            },
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);

    return response;
};

const updateBookById = (req, res) => {
    const { id } = req.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const pageValidate = pageCount >= readPage;
    let isValid = true;
    let errorMessage = '';
    const bookIndex = books.findIndex((p) => p.id === id);
    isValid = bookIndex !== -1 && name && pageValidate;

    if (isValid) {
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        return {
            status: 'success',
            message: 'Buku berhasil diperbarui',
        };
    }

    if (!name) errorMessage = 'Mohon isi nama buku';
    else if (bookIndex === -1) errorMessage = 'Id tidak ditemukan';
    else errorMessage = 'readPage tidak boleh lebih besar dari pageCount';

    const response = res.response({
        status: 'fail',
        message: `Gagal memperbarui buku. ${errorMessage}`,
    });

    response.code(bookIndex === -1 ? 404 : 400);

    return response;
};

const deleteBookById = (req, res) => {
    const { id } = req.params;

    const index = books.findIndex((p) => p.id === id);
    if (index !== -1) {
        books.splice(index, 1);

        return {
            status: 'success',
            message: 'Buku berhasil dihapus',
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

module.exports = {
 addBookHandler, getAllBooks, getBookById, updateBookById, deleteBookById,
};
