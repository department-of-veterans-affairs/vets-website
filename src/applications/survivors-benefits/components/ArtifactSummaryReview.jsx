import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import '@department-of-veterans-affairs/component-library/dist/components/va-table';
import '@department-of-veterans-affairs/component-library/dist/components/va-table-row';
import {
  transformDd214Entry,
  transformDeathCertificateEntry,
} from '../cave/transformers';

// THIS PAGE IS STILL IN DEVELOPMENT

const SectionTable = ({ section }) => (
  <div className="vads-u-margin-bottom--3">
    <h4 className="vads-u-font-size--md vads-u-margin-bottom--1">
      {section.heading}
    </h4>
    <va-table
      table-type="borderless"
      full-width="true"
      right-align-cols="1"
      uswds
    >
      <va-table-row slot="headers">
        <span className="vads-u-visibility--screen-reader">Field</span>
        <span right-align-cols className="vads-u-visibility--screen-reader">
          Value
        </span>
      </va-table-row>
      {section.rows.map(row => (
        <va-table-row key={row.label}>
          <span>{row.label}</span>
          <span right-align-cols className="vads-u-font-weight--bold">
            {row.value}
          </span>
        </va-table-row>
      ))}
    </va-table>
  </div>
);

SectionTable.propTypes = {
  section: PropTypes.shape({
    heading: PropTypes.string,
    rows: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    ),
  }).isRequired,
};

const ArtifactSummaryReview = ({ title }) => {
  const files = useSelector(state => state?.form?.data?.files ?? []);

  // Aggregate all artifact entries across every uploaded file
  const allDd214 = files.flatMap(f => f?.idpArtifacts?.dd214 ?? []);
  const allDeathCerts = files.flatMap(
    f => f?.idpArtifacts?.deathCertificates ?? [],
  );

  if (!allDd214.length && !allDeathCerts.length) {
    return null;
  }

  const allSections = [
    ...allDd214.flatMap(entry => transformDd214Entry(entry)),
    ...allDeathCerts.flatMap(entry => transformDeathCertificateEntry(entry)),
  ];

  return (
    <div>
      {title && (
        <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--2">
          {title}
        </h3>
      )}
      {allSections.map((section, idx) => (
        <SectionTable key={idx} section={section} />
      ))}
    </div>
  );
};

ArtifactSummaryReview.propTypes = {
  title: PropTypes.string,
};

export default ArtifactSummaryReview;
