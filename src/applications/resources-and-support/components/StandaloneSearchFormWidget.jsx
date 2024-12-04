import React, { useState } from 'react';
import '../style.scss';
import SearchBar from './SearchBar';

const StandaloneSearchFormWidget = () => {
  const [term, setTerm] = useState('');

  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--3">
        <SearchBar
          onInputChange={setTerm}
          useDefaultFormSearch
          userInput={term}
        />
      </div>
    </div>
  );
};

export default StandaloneSearchFormWidget;
