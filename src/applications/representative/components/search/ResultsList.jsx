import React from 'react';
// import SearchResult from './SearchResult';

const ResultsList = ({ handleRedirect }) => {
  const resultData = [
    {
      distance: 1.25,
      organization: 'Catholic War Veterans of the USA (081)',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      distance: 1.25,
      organization: 'Polish Legion of American Veterans (003)',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      distance: 1.25,
      organization: 'National Association of County Veterans Service Of (064)',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
    {
      distance: 1.25,
      organization: 'Jewish War Veterans of the USA (086)',
      type: 'VSO',
      address: '234 Main Street, Anytown, VT 05495',
      phone: '(123) 234-5678',
    },
  ];

  return (
    <>
      <div className="representative-results-list">
        <main>
          <va-table table-title="My table">
            <va-table-row slot="headers">
              <span>Distance</span>
              <span>Organization</span>
              <span>Address</span>
              <span>Phone</span>
              <span>Select</span>
            </va-table-row>
            {resultData.map((result, index) => {
              return (
                <va-table-row key={index}>
                  <span>{result.distance} Mi</span>
                  <span>{result.organization}</span>
                  <span>{result.address}</span>
                  <span>{result.phone}</span>
                  <span>
                    {' '}
                    <va-button onClick={e => handleRedirect(e)} text="Select" />
                  </span>
                </va-table-row>
              );
            })}
          </va-table>
        </main>
      </div>
    </>
  );
};

export default ResultsList;
