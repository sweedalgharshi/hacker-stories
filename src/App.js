import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
// import { Fragment } from 'react';

const App = () => {
  //you can do something in between
  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark ',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({ data: { stories: initialStories } });
      }, 2000)
    );

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [stories, setStories] = useState([]);

  useEffect(() => {
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
    });
  }, []);

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  // A : a callback function gets sintroduced
  const handleSearch = (event) => {
    //C : but, "calls back" to the place it was called
    console.log(searchTerm);
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log('App Renders');
  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* B*/}
      <InputWithLabel
        id={'search'}
        type={'text'}
        onInputChange={handleSearch}
        isFocused
        value={searchTerm}
      >
        <strong>Search :</strong>
      </InputWithLabel>
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      {/* render the list here */}
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  // console.log('List Renders');
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => {
  // console.log('Item renders');

  const handleRemoveItem = () => {
    onRemoveItem(item);
  };
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

// const Search = ({ onSearch, searchTerm }) => {
//   //do  something in between

//   // const handleChange = (event) => {
//   //   setSearchTerm(event.target.value);

//   //   //B: is used elsewhere
//   //   onSearch(event);
//   // };
//   return (
//     <Fragment>
//       <label htmlFor="search">Search: </label>
//       <input type="text" id="search" onChange={onSearch} value={searchTerm} />
//       <p>Searching for: {searchTerm}</p>
//     </Fragment>
//   );
// };

const InputWithLabel = ({
  id,
  value,
  onInputChange,
  type,
  isFocused,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        type={type}
        id={id}
        value={value}
        onChange={onInputChange}
        ref={inputRef}
      />
    </>
  );
};

export default App;
