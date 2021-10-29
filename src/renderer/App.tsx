import { useEffect, useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { books } from './util/books';

export type Book = {
  name: string;
  name_id: string;
  total: number;
  value: string;
  type: string;
};

export type Verse = {
  text: string;
  verse: number;
  book_name: string;
  chapter: number;
};

const Hello = () => {
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>();
  useEffect(() => {
    fetchData().catch();
  }, [selectedBook, selectedChapter]);

  const fetchData = async () => {
    const res = await fetch(
      `https://bible-api.com/${selectedBook.value}_${selectedChapter}`
    );
    const data = await res.json();
    console.log(data);
    setVerses(data.verses);
  };

  const _onBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    const selected = books.find((book) => book.name === val);
    if (!selected) {
      throw new Error('unexpected');
    }
    setSelectedBook(selected);
  };

  const _onChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    console.log('selected chapter: ', val);
    setSelectedChapter(parseInt(val));
  };

  const getBooks = () => {
    const comps = books.map((book) => (
      <option value={book.name}>{book.name}</option>
    ));
    return <>{comps}</>;
  };

  const getChapters = () => {
    const numbers = Array.from({ length: selectedBook.total }, (_, k) => k + 1);
    const comps = numbers.map((n) => <option value={n + ''}>{n}</option>);
    return <>{comps}</>;
  };

  return (
    <Container>
      <Navbar expand="lg" variant="dark" bg="dark" fixed="top" id="navbar">
        <select onChange={_onBookChange}>{getBooks()}</select>

        <select style={{ marginLeft: 10 }} onChange={_onChapterChange}>
          {getChapters()}
        </select>
      </Navbar>
      <div style={{ padding: 30 }}>
        {verses &&
          verses.map((verse: any) => (
            <p style={{ color: 'white' }}>{`${verse.verse}. ${verse.text}`}</p>
          ))}
      </div>
    </Container>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
