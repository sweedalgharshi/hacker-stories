import * as React from 'react';
import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import axios from 'axios';
// import { Fragment } from 'react';

import styles from './App.module.css';

const ACTIONS = {
  SET_STORIES: 'set-stories',
  REMOVE_STORIES: 'remove-stories',
  STORIES_FETCH_INIT: 'stories-fetch-init',
  STORIES_FETCH_SUCCESS: 'stories-fetch-success',
  STORIES_FETCH_FAILURE: 'stories-fetch-failure',
};

//A
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// const initialStories = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org/',
//     author: 'Dan Abramov, Andrew Clark ',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

// const getAsyncStories = () =>
//   new Promise(
//     (resolve) =>
//       setTimeout(() => resolve({ data: { stories: initialStories } })),
//     2000
//   );

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (stories, action) => {
  switch (action.type) {
    // case ACTIONS.SET_STORIES:
    //   return action.payload;

    case ACTIONS.STORIES_FETCH_INIT:
      return {
        ...stories,
        isLoading: true,
        isError: false,
      };

    case ACTIONS.STORIES_FETCH_SUCCESS:
      return {
        ...stories,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

    case ACTIONS.STORIES_FETCH_FAILURE:
      return {
        ...stories,
        isLoading: false,
        isError: true,
      };

    case ACTIONS.REMOVE_STORIES:
      return {
        ...stories,
        data: stories.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  //you can do something in between

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  // const [stories, setStories] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: ACTIONS.STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: ACTIONS.STORIES_FETCH_FAILURE,
      });
    }

    // axios
    //   .get(url) //B
    //   // .then((response) => response.json()) //C
    //   .then((result) => {
    //     dispatchStories({
    //       type: ACTIONS.STORIES_FETCH_SUCCESS,
    //       payload: result.data.hits, //D
    //     });
    //   })
    //   .catch(() => dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE }));
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: ACTIONS.REMOVE_STORIES,
      payload: item,
    });
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );

    // dispatchStories({
    //   type: 'SET_STORIES',
    //   payload: newStories,
    // });
  };

  // A : a callback function gets sintroduced
  const handleSearchInput = (event) => {
    //C : but, "calls back" to the place it was called
    console.log(searchTerm);
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log('App Renders');
  return (
    <div className={styles.container}>
      <h1 className={styles.primaryHeadline}>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchSubmit={handleSearchSubmit}
        onSearchInput={handleSearchInput}
      />

      {stories.isError && <p>Something went wrong....</p>}

      {stories.isLoading ? (
        <p>Loading.....</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

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
    <li className={styles.item}>
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button
          type="button"
          onClick={handleRemoveItem}
          className={`${styles.button} ${styles.buttonSmall}`}
        >
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
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>
      &nbsp;
      <input
        type={type}
        id={id}
        value={value}
        onChange={onInputChange}
        ref={inputRef}
        className={styles.input}
      />
    </>
  );
};

const SearchForm = ({ searchTerm, onSearchSubmit, onSearchInput }) => {
  return (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      {/* B*/}
      <InputWithLabel
        id={'search'}
        type={'text'}
        onInputChange={onSearchInput}
        isFocused
        value={searchTerm}
      >
        <strong>Search :</strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!searchTerm}
        className={`${styles.button} ${styles.buttonLarge}`}
      >
        Submit
      </button>
    </form>
  );
};

export default App;
