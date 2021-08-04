import React from 'react';
import classNames from 'classnames';
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
  const empties = [];

  for (let i = 0; i < 3 - institutions.length; i++) {
    empties.push(
      <div key={i} className="small-screen:vads-l-col--3">
        <div className="empty-col" />
      </div>,
    );
  }

  const fieldLabel = (field, index, displayDiff) => {
    return (
      <div
        key={`${index}-label`}
        className={classNames(
          'field-label',
          {
            'small-screen:vads-l-col--3':
              institutions.length === 3 && !smallScreen,
          },
          {
            'small-screen:vads-l-col--4':
              institutions.length === 2 && !smallScreen,
          },
          {
            'small-screen:vads-l-col--6':
              institutions.length === 1 && !smallScreen,
          },
          {
            'small-screen:vads-l-col--12':
              institutions.length === 0 && !smallScreen,
          },
          { 'has-diff': displayDiff },
        )}
      >
        <div
          className={classNames(
            'label-cell',
            { first: index === 0 },
            { 'has-diff': displayDiff },
          )}
        >
          {displayDiff && (
            <div className="label-diff">
              <i className={`fas fa-asterisk`} />
            </div>
          )}
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
        className={classNames(
          'field-value',
          {
            'small-screen:vads-l-col--3':
              institutions.length === 3 && !smallScreen,
          },
          {
            'small-screen:vads-l-col--4':
              institutions.length === 2 && !smallScreen,
          },
          {
            'small-screen:vads-l-col--6':
              institutions.length === 1 && !smallScreen,
          },
          { 'first-row': rowIndex === 0 },
          { 'first-col': colIndex === 0 },
          { 'last-col': colIndex === institutions.length - 1 },
          { 'has-diff': displayDiff },
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
        <div className="compare-header-section">{sectionLabel}</div>
      )}
      {subSectionLabel && (
        <div
          className={classNames('compare-header-subsection', {
            'vads-u-margin-top--4': !sectionLabel,
          })}
        >
          {subSectionLabel}
        </div>
      )}
      <div className={classNames({ 'vads-l-row': !smallScreen })}>
        <div
          className={classNames(
            {
              'small-screen:vads-l-col--12':
                institutions.length === 3 && !smallScreen,
            },
            {
              'small-screen:vads-l-col--9':
                institutions.length === 2 && !smallScreen,
            },
            {
              'small-screen:vads-l-col--6':
                institutions.length === 1 && !smallScreen,
            },
            {
              'small-screen:vads-l-col--3':
                institutions.length === 0 && !smallScreen,
            },
          )}
        >
          {fieldData.map((field, index) => {
            const rowValues = institutions.map(field.mapper);

            let allEqual = true;

            for (let i = 0; i < rowValues.length - 1 && allEqual; i++) {
              allEqual = _.isEqual(rowValues[i], rowValues[i + 1]);
            }

            const displayDiff = showDifferences && !allEqual;

            const columns = [fieldLabel(field, index, displayDiff)];

            if (institutions.length > 0) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  0,
                  institutions[0],
                  displayDiff,
                ),
              );
            }

            if (institutions.length > 1) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  1,
                  institutions[1],
                  displayDiff,
                ),
              );
            }

            if (institutions.length > 2) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  2,
                  institutions[2],
                  displayDiff,
                ),
              );
            }

            return (
              <div
                key={index}
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

export default CompareGrid;
