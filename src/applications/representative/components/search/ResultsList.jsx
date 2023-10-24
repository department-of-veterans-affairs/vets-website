import React from 'react';
// import SearchResult from './SearchResult';

const ResultsList = ({ handleRedirect }) => {
  const resultData = [
    {
      distance: 1.25,
      organization: 'Catholic War Veterans of the USA (081)',
      type: 'VSO',
      addressLine1: '237-20 92nd Road',
      addressLine2: 'Bellerose, NY 11426',
      phone: '(702) 684-2997',
    },
    {
      distance: 1.55,
      organization: 'Polish Legion of American Veterans (003)',
      type: 'VSO',
      addressLine1: '237-20 92nd Road',
      addressLine2: 'Bellerose, NY 11426',
      phone: '(703) 549-3622',
    },
    {
      distance: 1.65,
      organization: 'National Association of County Veterans Service Of (064)',
      type: 'VSO',
      addressLine1: 'Union County Services',
      addressLine2: 'Elizabeth, NJ 07207',
      phone: '(856) 780-1380',
    },
    {
      distance: 1.75,
      organization: 'Jewish War Veterans of the USA (086)',
      type: 'VSO',
      addressLine1: '237-20 92nd Road',
      addressLine2: 'Bellerose, NY 11426',
      phone: '(377) 777-8157',
    },
    {
      distance: 2.05,
      organization: 'Vietnam Veterans of America (070)',
      type: 'VSO',
      addressLine1: '616 E. Landis Ave.',
      addressLine2: 'Vineland, NJ 08360',
      phone: '(856) 293-7321',
    },
  ];

  return (
    <>
      <div className="representative-results-list" style={{ marginBottom: 25 }}>
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
                  <span>
                    <address>
                      <span>{result.addressLine1}</span>
                      <br />
                      <span>{result.addressLine2}</span>
                    </address>
                  </span>
                  <span>
                    <a href="/">{result.phone}</a>
                  </span>
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
