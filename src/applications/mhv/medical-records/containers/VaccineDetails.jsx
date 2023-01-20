import React from 'react';

const VaccineDetails = () => {
  return (
    <div className="vads-l-grid-container">
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        <p className="vads-l-col--3">Januarry 13, 2023</p>
        <button className="vads-l-col--3" type="button">
          Print
        </button>
      </div>
      <h1 className="vads-u-margin-bottom--1p5">FLU vaccines</h1>
      <div className="detail-block">
        <h2>Type and dosage</h2>
        <p>This is some content about the type and dosage.</p>
        <h2>Series</h2>
        <p>This is some content about the series.</p>
        <h2>Provider</h2>
        <p>This is some content about the provider.</p>
        <h2>Reaction</h2>
        <p>This is some content about any potential reactions.</p>
        <h2>Comments</h2>
        <p>These are comments.</p>
      </div>
    </div>
  );
};

export default VaccineDetails;
