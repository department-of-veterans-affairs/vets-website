import React from 'react';
import { mockDownloadStatements } from '../utils/mockData';

const DownloadStatements = () => (
  <article className="vads-u-padding--0">
    <h2 id="download-statements">Download your statements</h2>
    <p>
      Download your mailed statements for this facility from the past 6 months.
    </p>
    {mockDownloadStatements.map((statement, i) => (
      <div key={i} className="vads-u-margin-top--2">
        <a href="#">
          <i
            className="fas fa-download vads-u-margin-right--1"
            aria-hidden="true"
          />
          {statement.date} statement (PDF)
        </a>
      </div>
    ))}
  </article>
);

export default DownloadStatements;
