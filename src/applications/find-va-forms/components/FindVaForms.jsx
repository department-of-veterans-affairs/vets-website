import React from 'react';
import SearchForm from '../containers/SearchForm';
import SearchResults from '../containers/SearchResults';
import TopTasks from './TopTasks';

export default function() {
  return (
    <>
      <div className="vads-u-padding--4 vads-u-background-color--gray-lightest">
        <SearchForm />
        <SearchResults />
      </div>
      <TopTasks />
    </>
  );
}
