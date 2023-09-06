const { nanoid } = require("nanoid");
const books = require("./books");
const mappingObjectBook = require("./utils");

const addBookHandler = (req, h) => {
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

	const id = nanoid(16);
	const finished = Boolean(pageCount === readPage);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

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

	if (!name) {
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
				message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
			})
			.code(400);
	}

	books.push(newBook);
	const isSuccess = books.filter((book) => book.id === id).length > 0;

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
			status: "fail",
			message: "server error",
		})
		.code(500);
};

const getAllBooksHandler = (req, h) => {
	const allBooks = mappingObjectBook(books);

	const { name, reading, finished } = req.query;
	if (name) {
		const searchNameValue = name.toLowerCase();
		const results = allBooks.filter((book) => (
			book.name.toLowerCase().includes(searchNameValue)
		));
		return h
			.response({
				status: "success",
				data: {
					books: results,
				},
			})
			.code(200);
	}

	if (reading) {
		const searchReadingValue = Boolean(parseInt(reading, 10));
		const filterbook = books.filter((book) => (
			book.reading === searchReadingValue
		));

		const results = mappingObjectBook(filterbook);

		return h
			.response({
				status: "success",
				data: {
					books: results,
				},
			})
			.code(200);
	}

	if (finished) {
		const searchFinishedValue = Boolean(parseInt(finished, 10));
		const filterbook = books.filter((book) => (
			book.finished === searchFinishedValue
		));

		const results = mappingObjectBook(filterbook);

		return h
			.response({
				status: "success",
				data: {
					books: results,
				},
			})
			.code(200);
	}

	return h
		.response({
			status: "success",
			data: {
				books: allBooks,
			},
		})
		.code(200);
};

const getBookByIdHandler = (req, h) => {
	const { bookId } = req.params;

	const foundBook = books.find((book) => book.id === bookId);

	if (foundBook) {
		return h
			.response({
				status: "success",
				data: {
					book: foundBook,
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

const editBookByIdHandler = (req, h) => {
	const { bookId } = req.params;

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

	if (!name) {
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
				message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
			})
			.code(400);
	}

	const updatedAt = new Date().toISOString();
	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
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

const deleteBookByIdHandler = (req, h) => {
	const { bookId } = req.params;
	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
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
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};