// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import ComparisonBanner from '../../components/ComparisonBanner';
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';
import manifest from '../../manifest.json';

export const YellowRibbonApp = ({ hasFetchedOnce }) => (
  <>
    {/* Breadcrumbs */}
    <Breadcrumbs className="vads-u-padding--0">
      <a href="/">Home</a>
      <a href="/education/">Education and training</a>
      <a href={manifest.rootUrl}>Find a Yellow Ribbon school</a>
      {hasFetchedOnce && <a href={window.location.href}>Search results</a>}
    </Breadcrumbs>

    {/* Comparison Banner */}
    <ComparisonBanner />

    <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--4">
      {/* Title */}
      <div className="vads-l-col">
        <h1 className="vads-u-margin-bottom--0">
          {hasFetchedOnce
            ? 'Yellow Ribbon school search results'
            : 'Find a Yellow Ribbon school'}
        </h1>
      </div>

      <div className="vads-l-row">
        {/* Search Form */}
        <div className="vads-l-col--12">
          {/* Pre-form content */}
          {hasFetchedOnce ? (
            <>
              <p className="vads-l-col--9">
                Participating school information on this page is valid for the
                current academic year, from August 2019 through July 2020. To
                view schools for the previous academic year,{' '}
                <a href="" rel="noreferrer noopener">
                  download 2018 - 2019 rates (PDF)
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p className="vads-l-col--7">
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

              <p>
                Search for schools participating in the current academic year by
                one or all of the terms below.
              </p>
            </>
          )}
        </div>

        {/* Search Form */}
        <div className="vads-l-col--3">
          {hasFetchedOnce && (
            <h3 className="vads-u-margin-top--1p5">Search criteria</h3>
          )}

          <SearchForm />

          {hasFetchedOnce && (
            <>
              <h3 className="vads-u-margin-top--2">Helpful links</h3>
              <p className="vads-u-margin-bottom--1">
                <a href="/education/eligibility/" rel="noopener noreferrer">
                  Find out if you&apos;re eligible for the Post-9/11 GI Bill
                </a>
              </p>
              <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
                <a
                  href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/"
                  rel="noopener noreferrer"
                >
                  Find out if you qualify for the Yellow Ribbon Program
                </a>
              </p>
              <p className="vads-u-margin-top--1">
                <a href="/education/how-to-apply/" rel="noopener noreferrer">
                  Apply for Post-9/11 GI Bill benefits
                </a>
              </p>
            </>
          )}
        </div>

        {/* Search Results */}
        <div className="vads-l-col--9 vads-u-padding-left--5">
          <SearchResults />
        </div>

        {/* Post-Form Content */}
        {!hasFetchedOnce && (
          <p className="vads-l-col--7">
            Participating school information is for the current academic year.
            To view schools for the previous academic year,{' '}
            <a href="" rel="noreferrer noopener">
              download the historical rates (PDF)
            </a>
            .
          </p>
        )}
      </div>
    </div>
  </>
);

YellowRibbonApp.propTypes = {
  // From mapStateToProps.
  hasFetchedOnce: PropTypes.array,
};

const mapStateToProps = state => ({
  hasFetchedOnce: state.yellowRibbonReducer.hasFetchedOnce,
});

export default connect(
  mapStateToProps,
  null,
)(YellowRibbonApp);
