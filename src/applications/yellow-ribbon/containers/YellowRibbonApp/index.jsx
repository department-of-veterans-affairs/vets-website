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
            'vads-l-col--4': !results,
          })}
        >
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
            <a href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/">
              Learn more about the Yellow Ribbon Program.
            </a>
          )}
        </div>

        {/* Search Results */}
        <div
          className={classnames({
            'vads-l-col--9': !!results,
            'vads-l-col--8': !results,
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
