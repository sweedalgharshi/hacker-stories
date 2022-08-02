import * as React from 'react';
import { useState, useEffect, useRef, useReducer } from 'react';
// import { Fragment } from 'react';

const ACTIONS = {
  SET_STORIES: 'set-stories',
  REMOVE_STORIES: 'remove-stories',
  STORIES_FETCH_INIT: 'stories-fetch-init',
  STORIES_FETCH_SUCCESS: 'stories-fetch-success',
  STORIES_FETCH_FAILURE: 'stories-fetch-failure',
};

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

//A
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  //you can do something in between

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  // const [stories, setStories] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    // setIsLoading(true);
    if (!searchTerm) return;
    dispatchStories({ type: ACTIONS.STORIES_FETCH_INIT });

    fetch(`${API_ENDPOINT}${searchTerm}`) //B
      .then((response) => response.json()) //C
      .then((result) => {
        dispatchStories({
          type: ACTIONS.STORIES_FETCH_SUCCESS,
          payload: result.hits, //D
        });
      })
      .catch(() => dispatchStories({ type: ACTIONS.STORIES_FETCH_FAILURE }));
  }, [searchTerm]);

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
  const handleSearch = (event) => {
    //C : but, "calls back" to the place it was called
    console.log(searchTerm);
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
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
