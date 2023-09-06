const mappingObjectBook = (obj) => obj.map((book) => ({
	id: book.id,
	name: book.name,
	publisher: book.publisher,
}));

module.exports = mappingObjectBook;