import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  capitalizeFirstLetter,
  formatList,
  formatResultCount,
  mappedStates,
} from '../utils/helpers';

const LicenseCertificationSearchInfo = forwardRef(
  (
    {
      filteredResults,
      currentPage,
      itemsPerPage,
      activeCategories,
      nameParam,
      stateParam,
      previousRouteHome,
    },
    ref,
  ) => {
    const renderSearchInfo = () => {
      const valuesToCheck = ['license', 'certification', 'prep course'];

      const allValuesIncluded = valuesToCheck.every(value =>
        activeCategories.includes(value),
      );

      return (
        <>
          {allValuesIncluded ? (
            <span className="info-option vads-u-padding-right--0p5">
              "<strong>All</strong>
              ",
            </span>
          ) : (
            activeCategories.map((category, index) => {
              return (
                <span
                  className="info-option vads-u-padding-right--0p5"
                  key={index}
                >
                  "
                  <strong key={index}>
                    {capitalizeFirstLetter(category, ['course'])}
                  </strong>
                  "{(!previousRouteHome || nameParam) && <>,</>}
                </span>
              );
            })
          )}
          <span className="info-option">
            {nameParam && (
              <>
                {' '}
                "<strong>{nameParam}</strong>"{' '}
              </>
            )}
            {!previousRouteHome && nameParam && <>,</>}{' '}
          </span>
          {!previousRouteHome && (
            <span className="info-option">
              "
              <strong>
                {stateParam === 'all'
                  ? 'All'
                  : mappedStates.find(state => stateParam === state.optionValue)
                      .optionLabel}
              </strong>
              "{' '}
            </span>
          )}
        </>
      );
    };

    const renderNoResults = (name, state) => {
      const formatState = () => {
        if (state === 'all') {
          return 'all';
        }
        return (
          <>
            "
            <strong>
              {
                mappedStates.find(
                  mappedState => mappedState.optionValue === stateParam,
                ).optionLabel
              }
            </strong>
            "
          </>
        );
      };

      const formattedCategories = formatList(
        activeCategories.filter(activeCategory => activeCategory !== 'all'),
      );

      const formatName = () => {
        if (name) {
          return (
            <>
              for "<strong>{nameParam}</strong>"
            </>
          );
        }

        return null;
      };

      const classes =
        'vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-bottom--4';

      if (activeCategories.length === 0) {
        return (
          <p className={classes}>
            To see your results, select a category type filter and update search
            or select reset search.
          </p>
        );
      }

      if (formatState() === 'all') {
        return (
          <p className={classes}>
            There is no {formattedCategories} available {formatName()}.
          </p>
        );
      }
      if (activeCategories.includes('certification')) {
        if (activeCategories.length > 1) {
          return (
            <p className={classes}>
              There is no {formattedCategories} {formatName()} available in the
              state of {formatState()}. All certifications are available
              nationwide.
            </p>
          );
        }
        return (
          <p className={classes}>
            There is no certification available {formatName()}.
          </p>
        );
      }
      return (
        <p className={classes}>
          There is no {formattedCategories} {formatName()} available in the
          state of {formatState()}.
        </p>
      );
    };

    return (
      <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
        {filteredResults.length === 0 ? (
          <>{renderNoResults(nameParam, stateParam)}</>
        ) : (
          <p
            ref={ref}
            className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--4"
            tabIndex="-1"
            role="status"
            aria-atomic="true"
            aria-live="polite"
          >
            Showing{' '}
            <>
              {`${formatResultCount(
                filteredResults,
                currentPage,
                itemsPerPage,
              )} of ${filteredResults.length} results for `}
              {renderSearchInfo()}
            </>
          </p>
        )}
      </div>
    );
  },
);

LicenseCertificationSearchInfo.propTypes = {
  activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentPage: PropTypes.number.isRequired,
  filteredResults: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  nameParam: PropTypes.string,
  previousRouteHome: PropTypes.bool.isRequired,
  stateParam: PropTypes.string.isRequired,
};

LicenseCertificationSearchInfo.defaultProps = {
  nameParam: '',
};

export default LicenseCertificationSearchInfo;
