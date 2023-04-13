import React from 'react';
import { dateFormat, downloadFile } from '../../util/helpers';
import PrintHeader from '../shared/PrintHeader';
import ItemList from '../shared/ItemList';
import { getVaccinePdf } from '../../api/MrApi';

const EkgDetails = props => {
  const { results } = props;

  const formattedDate = dateFormat(results?.date, 'MMMM D, YYYY');

  const download = () => {
    getVaccinePdf(1).then(res =>
      downloadFile('electrocardiogram.pdf', res.pdf),
    );
  };

  const content = () => {
    if (results) {
      return (
        <>
          <PrintHeader />
          <h1 className="condition-header">{results.name}</h1>
          <div className="time-header">
            <h2>Date performed: </h2>
            <p>{formattedDate}</p>
          </div>
          <div className="condition-buttons vads-u-display--flex vads-u-padding-y--3 vads-u-margin-y--0 no-print">
            <button
              className="link-button vads-u-margin-right--3 no-print"
              type="button"
              onClick={window.print}
            >
              <i
                aria-hidden="true"
                className="fas fa-print vads-u-margin-right--1"
                data-testid="print-records-button"
              />
              Print page
            </button>
            <button
              className="link-button no-print"
              type="button"
              onClick={download}
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--1"
              />
              Download page
            </button>
          </div>
          <div className="condition-details max-80">
            <h2>Procedure and test(s)</h2>
            <p>Electrocardiogram</p>
            <h2>Ordering location</h2>
            <p>
              {results.facility || 'There is no facility reported at this time'}
            </p>
            <h2 className="vads-u-margin-bottom--0">Provider comments</h2>
            <ItemList
              list={results.comments}
              emptyMessage="No comments at this time"
            />
          </div>
        </>
      );
    }
    return <></>;
  };

  return (
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      id="condition-details"
    >
      {content()}
    </div>
  );
};

export default EkgDetails;
