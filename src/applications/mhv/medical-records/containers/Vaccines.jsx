import React from 'react';
import RecordList from '../components/RecordList';
import vaccines from '../tests/fixtures/vaccines.json';

const Vaccines = () => {
  return (
    <div className="vaccines vads-l-grid-container">
      <div className="breadcrumb-placeholder">
        &#8249; <span>Health history</span>
      </div>
      <h1>VA vaccines</h1>
      <div className="text-placeholder text-placeholder-medium" />
      <div className="text-placeholder text-placeholder-large" />
      <div className="text-placeholder text-placeholder-small" />
      <va-button
        text="Print"
        onClick={() => {}}
        data-testid="print-records-button"
      />
      <RecordList records={vaccines} type="vaccine" />
    </div>
  );
};

export default Vaccines;
