const { nanoid } = require("nanoid");
const Books = require("./books");

// get All Books Handler
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBook = Books;

  if (name) {
    filteredBook = Books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!filteredBook) {
      filteredBook = Books.filter((book) =>
        book.publisher.toLowerCase().includes(name.toLowerCase())
      );
    }
  }

  if (reading) {
    filteredBook = Books.filter((book) => book.reading == reading);
  }

  if (finished) {
    filteredBook = Books.filter((book) => book.finished == finished);
  }

  const books = filteredBook.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return h
    .response({
      status: "success",
      data: {
        books,
      },
    })
    .code(200);
};
// get Books By Id Handler
const getBooksById = (request, h) => {
  const { bookId } = request.params;
  const book = Books.find(({ id }) => id === bookId);

  if (book) {
    return h
      .response({
        status: "success",
        data: {
          book,
        },
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
};

const createBooks = (request, h) => {
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const {
    name = "",
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === "") {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  Books.push(newBook);

  const isSuccess = Books.find((book) => book.id === id);

  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  return h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(400);
};

const updateBooks = (request, h) => {
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();
  const {
    name = "",
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === "") {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const bookIndex = Books.findIndex((note) => note.id === bookId);

  if (bookIndex !== -1) {
    Books[bookIndex] = {
      ...Books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage,
      reading,
      updatedAt,
    };

    return h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
};

const deleteBooks = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = Books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    Books.splice(bookIndex, 1);

    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
};

module.exports = {
  getAllBooks,
  getBooksById,
  createBooks,
  updateBooks,
  deleteBooks,
};
