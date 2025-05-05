import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import appendQuery from 'append-query';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import Checkbox from './Checkbox';
import SchoolClassification from './SchoolClassification';
import CompareScroller from './CompareScroller';

export default function CompareHeader({
  currentScroll,
  institutions,
  setPromptingFacilityCode,
  setShowDifferences,
  scrollClickHandler,
  showDifferences,
  smallScreen,
  version,
}) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const giCtCollab = useToggleValue(TOGGLE_NAMES.giCtCollab);

  useEffect(() => {
    focusElement('.compare-page-description-label');
  }, []);

  const empties = [];
  for (let i = 0; i < 3 - institutions.length; i++) {
    empties.push(
      <div key={i} className="small-screen:vads-l-col--3 institution-card">
        <div className="compare-header empty-header" />
        <div className="compare-action">
          <Link to={giCtCollab ? '/schools-and-employers' : '/search'}>
            Return to search to add
          </Link>
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

  const handleOnChange = e => {
    setShowDifferences(e.target.checked);
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'Highlight differences',
      'gibct-form-value': e.target.checked,
    });
  };
  const highlightDifferences = (
    <span aria-label="A highlighted row indicates the information is different between your selected institutions.">
      Highlight differences
    </span>
  );
  return (
    <div
      className={classNames({
        'vads-l-row': !smallScreen,
      })}
    >
      <div className="small-screen:vads-l-col--3 compare-controls non-scroll-parent">
        <div className="non-scroll-label">
          <div className="test-header compare-header vads-u-padding-right--1 vads-u-height--auto">
            <h1 className="compare-page-description-label">
              Institution comparison:
            </h1>
            View school information side by side to compare schools
          </div>
          <div className="compare-action">
            <Checkbox
              checked={showDifferences}
              label={highlightDifferences}
              name="highlight-differences"
              className="vads-u-display--inline-block"
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>
      {smallWrap(
        institutions.map((institution, index) => {
          const profileLink = version
            ? appendQuery(`/institution/${institution.facilityCode}`, {
                version,
              })
            : `/institution/${institution.facilityCode}`;
          return (
            <div
              className="small-screen:vads-l-col--3 institution-card"
              key={index}
            >
              <div className="compare-header institution-header">
                <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-height--full">
                  <SchoolClassification
                    institution={institution}
                    displayTraits={false}
                  />
                  <div className="header-fields vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-height--full">
                    <div className="institution-name">
                      <Link
                        data-testid="compare-header-link"
                        to={{
                          pathname: profileLink,
                          state: { prevPath: location.pathname },
                        }}
                        aria-labelledby={`${institution.facilityCode}-label ${institution.facilityCode}-classification`}
                      >
                        <span
                          aria-label={`${institution.name}, `}
                          id={`${institution.facilityCode}-label`}
                        >
                          {institution.name}
                        </span>
                      </Link>
                    </div>
                    <div className="compare-action">
                      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
                      <VaButton
                        secondary
                        text="Remove"
                        className="inst-remove-btn"
                        onClick={() => {
                          setPromptingFacilityCode(institution.facilityCode);
                        }}
                        aria-label={`Remove ${institution.name} from comparison`}
                      />
                    </div>
                  </div>
                </div>
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
CompareHeader.propTypes = {
  institutions: PropTypes.array.isRequired,
  scrollClickHandler: PropTypes.func.isRequired,
  setPromptingFacilityCode: PropTypes.func.isRequired,
  setShowDifferences: PropTypes.func.isRequired,
  showDifferences: PropTypes.bool.isRequired,
  smallScreen: PropTypes.bool.isRequired,
  currentScroll: PropTypes.number,
  version: PropTypes.string,
};
