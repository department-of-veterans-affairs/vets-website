/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import environment from 'platform/utilities/environment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

export function CompareGrid({
  className,
  showDifferences,
  fieldData,
  institutions,
  sectionLabel,
  smallScreen,
  subSectionLabel,
}) {
  // const sectionLabelArr = ;
  const sectionLabelId = `sectionLabel-${sectionLabel
    ?.split(' ')
    .map(word => `${word}-`)
    ?.join('')
    .slice(0, -1)}`;
  const sectionLabelIdOld = `sectionLabel${sectionLabel}`;
  const empties = [];

  for (let i = 0; i < 3 - institutions.length; i++) {
    empties.push(
      <div
        key={i}
        className={classNames('small-screen:vads-l-col--3', {
          'empty-field-1': smallScreen,
        })}
      >
        <div className="empty-col" />
      </div>,
    );
  }

  const colHeaders = institutions.map((institution, index) => {
    return (
      <div role="columnheader" key={index} className="sr-only">
        {institution.name}
      </div>
    );
  });

  const fieldLabel = (field, index, displayDiff) => {
    return (
      <div
        role="rowheader"
        key={`${index}-label`}
        className={classNames('field-label', {
          'small-screen:vads-l-col--3':
            institutions.length === 3 && !smallScreen,
          'small-screen:vads-l-col--4':
            institutions.length === 2 && !smallScreen,
          'small-screen:vads-l-col--6':
            institutions.length === 1 && !smallScreen,
          'small-screen:vads-l-col--12':
            institutions.length === 0 && !smallScreen,
          'has-diff': displayDiff,
        })}
      >
        <div
          tabIndex="0"
          className={classNames('label-cell', {
            first: index === 0,
            'has-diff': displayDiff,
          })}
          aria-label={
            displayDiff
              ? 'This row displays information that is different between your selected institutions'
              : null
          }
        >
          {field.label}
        </div>
      </div>
    );
  };

  const institutionFieldValue = (
    field,
    rowIndex,
    colIndex,
    institution,
    displayDiff,
  ) => {
    const valueClassName =
      typeof field.className === 'function'
        ? field.className(institution)
        : field.className;

    return (
      <div
        key={institution.facilityCode}
        tabIndex="0"
        role="cell"
        className={classNames(
          'field-value',
          {
            'small-screen:vads-l-col--3':
              institutions.length === 3 && !smallScreen,
            'small-screen:vads-l-col--4':
              institutions.length === 2 && !smallScreen,
            'small-screen:vads-l-col--6':
              institutions.length === 1 && !smallScreen,
            'first-row': rowIndex === 0,
            'first-col': colIndex === 0,
            'last-col': colIndex === institutions.length - 1,
            'has-diff': displayDiff,
          },
          valueClassName,
        )}
      >
        {field.mapper(institution)}
      </div>
    );
  };

  return (
    <div className={classNames('compare-grid', className)}>
      {sectionLabel && (
        <div className="compare-header-section non-scroll-parent">
          <div
            className="non-scroll-label"
            id={environment.isProduction() ? sectionLabelIdOld : sectionLabelId}
            tabIndex="0"
          >
            <h2>{sectionLabel}</h2>
          </div>{' '}
        </div>
      )}
      {subSectionLabel && (
        <div
          className={classNames('compare-header-subsection non-scroll-parent', {
            'vads-u-margin-top--4': !sectionLabel,
          })}
        >
          <div tabIndex="0" className="non-scroll-label">
            <h3>{subSectionLabel}</h3>
          </div>
        </div>
      )}
      <div
        role="table"
        aria-labelledby={sectionLabelId}
        className={classNames('grid-data-parent', 'vads-u-margin-bottom--3', {
          'vads-l-row': !smallScreen,
        })}
      >
        <div role="rowgroup">
          <div role="row">
            <div role="columnheader" className="sr-only">
              Comparing
            </div>
            {colHeaders}
          </div>
        </div>

        <div
          role="rowgroup"
          className={classNames({
            'grid-data-2': empties.length === 1,
            'grid-data-1': empties.length === 2,
            'small-screen:vads-l-col--12':
              institutions.length === 3 && !smallScreen,
            'small-screen:vads-l-col--9':
              institutions.length === 2 && !smallScreen,
            'small-screen:vads-l-col--6':
              institutions.length === 1 && !smallScreen,
            'small-screen:vads-l-col--3':
              institutions.length === 0 && !smallScreen,
          })}
        >
          {fieldData.map((field, index) => {
            const rowValues = institutions.map(field.mapper);
            let allEqual = true;

            for (let i = 0; i < rowValues.length - 1 && allEqual; i++) {
              allEqual = _.isEqual(rowValues[i], rowValues[i + 1]);
            }

            const displayDiff = showDifferences && !allEqual;
            const columns = [fieldLabel(field, index, displayDiff)];
            for (let i = 0; i < institutions.length; i++) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  i,
                  institutions[i],
                  displayDiff,
                ),
              );
            }

            return (
              <div
                key={index}
                role="row"
                className={classNames({
                  'columns vads-l-row': !smallScreen,
                })}
              >
                {columns}
              </div>
            );
          })}
        </div>
        {empties}
      </div>
    </div>
  );
}

CompareGrid.propTypes = {
  className: PropTypes.string || undefined,
  fieldData: PropTypes.array,
  institutions: PropTypes.array,
  sectionLabel: PropTypes.string,
  showDifferences: PropTypes.bool,
  smallScreen: PropTypes.bool,
  subSectionLabel: PropTypes.string || undefined,
};

export default CompareGrid;
