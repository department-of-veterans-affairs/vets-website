import React from 'react';
import appendQuery from 'append-query';
import classNames from 'classnames';
import Checkbox from './Checkbox';
import SchoolClassification from './SchoolClassification';
import { Link } from 'react-router-dom';
import CompareScroller from './CompareScroller';

export default function({
  currentScroll,
  institutionCount,
  institutions,
  setPromptingFacilityCode,
  setShowDifferences,
  scrollClickHandler,
  showDifferences,
  smallScreen,
}) {
  const empties = [];
  for (let i = 0; i < 3 - institutionCount; i++) {
    empties.push(
      <div key={i} className="small-screen:vads-l-col--3 institution-card">
        <div className="compare-header empty-header" />
        <div className="compare-action">
          <Link to={'/search'}>Return to search to add</Link>
        </div>
      </div>,
    );
  }

  const smallWrap = cards => {
    return smallScreen ? (
      <div className="card-wrapper">
        {cards}
        {empties}
      </div>
    ) : (
      cards
    );
  };

  return (
    <div
      className={classNames({
        'vads-l-row': !smallScreen,
      })}
    >
      <div className="small-screen:vads-l-col--3 compare-controls non-scroll-parent">
        <div className="non-scroll-label">
          <div className="test-header compare-header vads-u-padding-right--1">
            <div className="compare-page-description-label">
              School comparison:
            </div>
            View school information side by side to compare schools
          </div>
          <div className="compare-action">
            <Checkbox
              checked={showDifferences}
              label={
                <span>
                  <i className={`fas fa-asterisk`} /> Highlight differences
                </span>
              }
              name="highlight-differences"
              className="vads-u-display--inline-block"
              onChange={e => setShowDifferences(e.target.checked)}
            />
          </div>
        </div>
      </div>
      {smallWrap(
        institutions.map((institution, index) => {
          return (
            <div
              className="small-screen:vads-l-col--3 institution-card"
              key={index}
            >
              <div className="compare-header institution-header">
                <div>
                  <SchoolClassification institution={institution} />
                  <div className="header-fields">
                    <div className="institution-name">
                      {smallScreen && institution.name}
                      {!smallScreen && (
                        <Link
                          to={appendQuery(
                            `/profile/${institution.facilityCode}`,
                          )}
                        >
                          {institution.name}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="compare-action">
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={() => {
                    setPromptingFacilityCode(institution.facilityCode);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        }),
      )}
      {smallScreen && (
        <CompareScroller
          currentScroll={currentScroll}
          divisions={3}
          divisionWidth={340}
          onClick={scrollClickHandler}
        />
      )}
      {!smallScreen && empties}
    </div>
  );
}
