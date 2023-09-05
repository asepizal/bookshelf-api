const { nanoid } = require("nanoid")
const books = require("./books")

const addBookHandler = (req, h) => {
   const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
   } = req.payload

   const id = nanoid(16)
   const finished = Boolean(pageCount === readPage)
   const insertedAt = new Date().toISOString()
   const updatedAt = insertedAt

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
      updatedAt
   }

   if (!name) {
      return h
         .response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
         })
         .code(400)
   }
   if (readPage > pageCount) {
      return h
         .response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
         })
         .code(400)
   }

   books.push(newBook)
   const isSuccess = books.filter((book) =>
      book.id === id
   ).length > 0

   if (isSuccess) {
      return h
         .response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
               "bookId": id
            }
         })
         .code(201)
   }
}

const getAllBooksHandler = (req, h) => {
   const allBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
   }))

   return h
      .response({
         "status": "success",
         "data": {
            "books": allBooks
         }
      })
      .code(200)
}

const getBookByIdHandler = (req, h) => {
   const bookId = req.params.bookId

   const foundBook = books.find(book => book.id === bookId)

   if (foundBook) {
      return h
         .response({
            "status": "success",
            "data": {
               "book": foundBook
            }
         })
         .code(200)
   }

   return h
      .response({
         "status": "fail",
         "message": "Buku tidak ditemukan"
      })
      .code(404)
}

module.exports = {
   addBookHandler,
   getAllBooksHandler,
   getBookByIdHandler
}