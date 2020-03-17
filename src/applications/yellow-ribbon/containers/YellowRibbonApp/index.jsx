// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
// Relative imports.
import ComparisonBanner from '../../components/ComparisonBanner';
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';

export const YellowRibbonApp = ({ results }) => (
  <>
    {/* Breadcrumbs */}
    <Breadcrumbs className="vads-u-padding--0">
      <a href="/">Home</a>
      <a href="/education/">Education and training</a>
      <a href="/yellow-ribbon/schools/">Find a Yellow Ribbon school</a>
      {results && <a href={window.location.href}>Search results</a>}
    </Breadcrumbs>

    {/* Comparison Banner */}
    <ComparisonBanner />

    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--4">
      {/* Title */}
      <div className="vads-l-col">
        <h1 className="vads-u-font-size--h2">Find a Yellow Ribbon school</h1>
      </div>

      <div className="vads-l-row">
        {/* Search Form */}
        <div
          className={classnames({
            'vads-l-col--3': !!results,
            'vads-l-col--6': !results,
          })}
        >
          {/* Pre-form content */}
          {!results && (
            <>
              <p>
                Find out if your school participates in the Yellow Ribbon
                program. If you already have Post-9/11 GI Bill benefits, the
                Yellow Ribbon program can help pay for higher out-of-state,
                private school, or graduate school tuition. The amount of money
                you get varies by school, degree type, and the program
                you&apos;re enrolled in.
              </p>
              <a
                href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/"
                rel="noopener noreferrer"
              >
                Find out if you qualify for the Yellow Ribbon Program.
              </a>
              <p>
                If you don&apos;t already have Post-9/11 GI Bill benefits, you
                can:
              </p>
              <ul>
                <li>
                  <a href="/education/eligibility/" rel="noreferrer noopener">
                    Find out if you&apos;re eligible for the Post-9/11 GI Bill
                  </a>
                </li>
                <li>
                  <a href="/education/how-to-apply/" rel="noreferrer noopener">
                    Apply for Post-9/11 GI Bill benefits
                  </a>
                </li>
              </ul>
              <p>Search for schools by one or all of the terms below.</p>
            </>
          )}

          {/* Search Form */}
          <SearchForm />
        </div>

        {/* Search Results */}
        <div
          className={classnames({
            'vads-l-col--9': !!results,
            'vads-l-col--6': !results,
            'vads-u-padding-left--4': true,
          })}
        >
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
