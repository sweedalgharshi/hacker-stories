import * as React from 'react';
import { useState } from 'react';

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

  // A : a callback function gets introduced
  const handleSearch = (event) => {
    //C : but, "calls back" to the place it was called
    console.log(event.target.value);
  };

  // console.log('App Renders');
  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* B*/}
      <Search onSearch={handleSearch} />
      <hr />
      <List list={stories} />
      {/* render the list here */}
    </div>
  );
};

const List = ({ list }) => {
  // console.log('List Renders');
  return (
    <ul>
      {list.map((item) => (
        <Item item={item} key={item.objectID} />
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

const Search = ({ onSearch }) => {
  //do  something in between
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event);
  };

  // console.log('Search');
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input type="text" id="search" onChange={handleChange} />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
};
export default App;
