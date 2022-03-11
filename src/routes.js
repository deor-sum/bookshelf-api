const {
  getAllBooks,
  getBooksById,
  createBooks,
  updateBooks,
  deleteBooks,
} = require("./handlerCtrl");

const routes = [
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBooksById,
  },
  {
    method: "POST",
    path: "/books",
    handler: createBooks,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBooks,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBooks,
  },
];

module.exports = routes;
