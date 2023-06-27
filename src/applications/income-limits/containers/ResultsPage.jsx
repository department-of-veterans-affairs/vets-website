import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import {
  getFirstAccordionHeader,
  getSecondAccordionHeader,
  getThirdAccordionHeader,
  getFourthAccordionHeader,
  getFifthAccordionHeader,
} from '../utilities/results-accordions';

/**
 * There are two pathways to displaying income ranges on this page
 * Both are mapped in this Mural: https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1683232214853/cfc6da5007d8f99ee0bc83e261e118e7074ffa85?wid=0-1683331066052&sender=ue51e6049230e03c1248b5078)
 * 1) Standard: GMT > NMT
 * 2) Non-standard: GMT < NMT  In some rural areas, the Geographic Means Test is lower than the National Means Test
 */
const Results = ({ results, yearInput }) => {
  const {
    gmt_threshold: gmt,
    national_threshold: national,
    pension_threshold: pension,
  } = results;

  const isStandard = gmt > national;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  return (
    <>
      <h1>Your income limits for {yearInput || currentYear}</h1>
      <p>
        In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
        justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra. Nam
        ac laoreet leo, nec fringilla libero. Maecenas ac felis non augue
        malesuada iaculis id sit amet tellus. Etiam molestie auctor neque, eu
        pharetra lacus rhoncus at.
      </p>
      <p>
        Morbi placerat nibh augue, sit amet aliquam ipsum mattis sed. Morbi
        pellentesque fermentum tortor, ac vestibulum ligula suscipit sit amet.
        Donec scelerisque lectus a eros pellentesque rutrum. Sed sit amet varius
        ipsum, ut rutrum lacus. Aliquam ut pulvinar sapien, eu gravida nisi.
      </p>
      <h2>Fusce risus lacus efficitur ac magna vitae</h2>
      <va-accordion bordered data-testid="il-results">
        <va-accordion-item
          data-testid="il-results-1"
          header={getFirstAccordionHeader(pension)}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          data-testid="il-results-2"
          header={getSecondAccordionHeader(pension, national)}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          data-testid="il-results-3"
          header={getThirdAccordionHeader(national, gmt, isStandard)}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          data-testid="il-results-4"
          header={getFourthAccordionHeader(national, gmt, isStandard)}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        {isStandard && (
          <va-accordion-item
            data-testid="il-results-5"
            header={getFifthAccordionHeader(gmt)}
          >
            In posuere, sem in ornare mattis, urna libero vulputate quam, a
            justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
            Nam ac laoreet leo, nec fringilla libero.
          </va-accordion-item>
        )}
      </va-accordion>
      <h2>Aliquam ut pulvinar sapien, eu gravida nisi</h2>
      <p>
        Aenean tortor lorem, commodo quis est at, interdum mollis ipsum.
        Suspendisse et nulla nisi.
      </p>
    </>
  );
};

const mapStateToProps = state => ({
  results: state?.incomeLimits?.results,
  yearInput: state?.incomeLimits?.form?.year,
});

Results.propTypes = {
  results: PropTypes.shape({
    // eslint-disable-next-line camelcase
    gmt_threshold: PropTypes.number,
    // eslint-disable-next-line camelcase
    national_threshold: PropTypes.number,
    // eslint-disable-next-line camelcase
    pension_threshold: PropTypes.number,
  }).isRequired,
  yearInput: PropTypes.string,
};

export default connect(mapStateToProps)(Results);
