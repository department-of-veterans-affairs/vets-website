// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';

const YellowRibbonApp = ({ results }) => (
  <>
    {/* Breadcrumbs */}
    <Breadcrumbs customClasses="vads-u-padding--0">
      <a href={`${window.location.origin}`} rel="noopener noreferrer">
        Home
      </a>
      <a
        href={`${window.location.origin}/education/`}
        rel="noopener noreferrer"
      >
        Education and training
      </a>
      <a
        href={`${window.location.origin}/yellow-ribbon/schools/`}
        rel="noopener noreferrer"
      >
        Yellow Ribbon school finder
      </a>
      {results && (
        <a href={window.location.href} rel="noopener noreferrer">
          Search results
        </a>
      )}
    </Breadcrumbs>

    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--4">
      {/* Title */}
      <div className="vads-l-col">
        <h1 className="vads-u-font-size--h2">Yellow Ribbon school finder</h1>
      </div>

      <div className="vads-l-row">
        {/* Search Form */}
        <div className="vads-l-col--4">
          {!results && (
            <>
              <p>
                You may be eligible for Yellow Ribbon program funding if you:
              </p>
              <ul>
                <li>
                  Are receiving Post 9-11 GI Bill benefits, <strong>and</strong>
                </li>
                <li>Attend a participating Yellow Ribbon program school</li>
              </ul>
              <p>
                The Yellow Ribbon program benefit varies by school, the degree
                you&apos;re working toward, and the program or division
                you&apos;re studying in.
              </p>
              <p>Search Yellow Ribbon program schools.</p>
            </>
          )}
          <SearchForm />
          {!results && (
            <a
              className="vads-u-padding-y--3"
              href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/"
              rel="noopener noreferrer"
            >
              Learn more about the Yellow Ribbon Program.
            </a>
          )}
        </div>

        {/* Search Results */}
        <div className="vads-l-col--8 vads-u-padding-left--2p5">
          <SearchResults />
        </div>
      </div>
    </div>
  </>
);

YellowRibbonApp.propTypes = {
  // From mapStateToProps.
  results: PropTypes.array,
};

const mapStateToProps = state => ({
  results: state.yellowRibbonReducer.results,
});

export default connect(
  mapStateToProps,
  null,
)(YellowRibbonApp);
