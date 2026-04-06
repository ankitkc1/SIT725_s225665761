fetch('/api/books')
  .then((response) => response.json())
  .then((result) => {
    const books = result.data;
    const bookList = document.getElementById('book-list');

    books.forEach((book) => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';

      bookCard.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
      `;

      bookList.appendChild(bookCard);
    });
  });