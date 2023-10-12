import React from 'react';
import SearchResult from './SearchResult';

const ResultsList = ({ handleRedirect }) => {
  const resultData = [
    {
      name: 'Jane Doe',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      name: 'Jane Doe',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      name: 'Jane Doe',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      name: 'Jane Doe',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
  ];

  return (
    <>
      <div className="representative-results-list">
        {resultData.map((result, index) => {
          return (
            <SearchResult
              name={result.name}
              key={index}
              type={result.type}
              address={result.address}
              phone={result.phone}
              handleRedirect={e => handleRedirect(e)}
            />
          );
        })}
      </div>
    </>
  );
};

export default ResultsList;
