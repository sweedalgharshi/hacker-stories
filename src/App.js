import * as React from 'react';
import { useState, useEffect } from 'react';

const App = () => {
  //you can do something in between
  const stories = [
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

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('search') || 'React'
  );

  useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

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
      <Search onSearch={handleSearch} searchTerm={searchTerm} />
      <hr />
      <List list={searchedStories} />
      {/* render the list here */}
    </div>
  );
};

const List = ({ list }) => {
  // console.log('List Renders');
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
};

const Item = ({ item }) => {
  // console.log('Item renders');
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
};

const Search = ({ onSearch, searchTerm }) => {
  //do  something in between

  // const handleChange = (event) => {
  //   setSearchTerm(event.target.value);

  //   //B: is used elsewhere
  //   onSearch(event);
  // };
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" onChange={onSearch} value={searchTerm} />
      <p>Searching for: {searchTerm}</p>
    </div>
  );
};
export default App;