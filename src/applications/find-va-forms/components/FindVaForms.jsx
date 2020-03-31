import React from 'react';
import SearchForm from '../containers/SearchForm';
import SearchResults from '../containers/SearchResults';
import TopTasks from './TopTasks';

export default function() {
  return (
    <>
      <SearchForm />
      <SearchResults />
      <TopTasks />
    </>
  );
}
