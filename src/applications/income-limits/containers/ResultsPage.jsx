import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const Results = ({ limits }) => {
  const {
    gmt_threshold: gmt,
    national_threshold: national,
    pension_threshold: pension,
  } = limits;

  return (
    <>
      <h1>Vivamus varius sem eget</h1>
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
      <h3>Fusce risus lacus efficitur ac magna vitae</h3>
      <va-accordion bordered data-testid="il-results">
        <va-accordion-item
          header={`${formatter.format(pension['0_dependent'])} or less`}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          header={`${formatter.format(
            pension['0_dependent'] + 1,
          )} - ${formatter.format(national['0_dependent'])}`}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          header={`${formatter.format(
            national['0_dependent'] + 1,
          )} - ${formatter.format(gmt)}`}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          header={`${formatter.format(gmt + 1)} - ${formatter.format(
            gmt * 1.1,
          )}`}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
        <va-accordion-item
          header={`${formatter.format(gmt * 1.1 + 1)} or more`}
        >
          In posuere, sem in ornare mattis, urna libero vulputate quam, a dictum
          justo nisl non tortor. Nulla at mauris non dolor dignissim pharetra.
          Nam ac laoreet leo, nec fringilla libero.
        </va-accordion-item>
      </va-accordion>
      <h2>Aliquam ut pulvinar sapien, eu gravida nisi</h2>
      <p>
        Aenean tortor lorem, commodo quis est at, interdum mollis ipsum.
        Suspendisse et nulla nisi.
      </p>
    </>
  );
};

Results.propTypes = {
  form: PropTypes.object.isRequired,
  limits: PropTypes.shape({
    // eslint-disable-next-line camelcase
    gmt_threshold: PropTypes.number,
    // eslint-disable-next-line camelcase
    national_threshold: PropTypes.shape({
      '0_dependent': PropTypes.number,
      '1_dependent': PropTypes.number,
      // eslint-disable-next-line camelcase
      additional_dependents: PropTypes.number,
    }),
    // eslint-disable-next-line camelcase
    pension_threshold: PropTypes.shape({
      '0_dependent': PropTypes.number,
      '1_dependent': PropTypes.number,
      // eslint-disable-next-line camelcase
      additional_dependents: PropTypes.number,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  form: state?.incomeLimits?.form,
  limits: state?.incomeLimits?.results?.limits,
});

export default connect(mapStateToProps)(Results);
