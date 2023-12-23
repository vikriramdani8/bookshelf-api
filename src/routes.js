const {
    addBookHandler,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
} = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: () => ({
                status: 'Ok',
                message: 'Server running',
            }),
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookById,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookById,
    },
];

module.exports = routes;
