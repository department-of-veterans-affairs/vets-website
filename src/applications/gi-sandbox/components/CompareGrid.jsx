import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

export function CompareGrid({
  className,
  showDifferences,
  facilityCodes,
  fieldData,
  institutions,
  sectionLabel,
  subSectionLabel,
}) {
  const institutionCount = Object.keys(institutions).length;

  const fieldLabel = (field, index, displayDiff) => {
    return (
      <div
        key={`${index}-label`}
        className={classNames(
          'field-label',
          { 'medium-screen:vads-l-col--3': institutionCount === 3 },
          { 'medium-screen:vads-l-col--4': institutionCount === 2 },
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
          { 'medium-screen:vads-l-col--3': institutionCount === 3 },
          { 'medium-screen:vads-l-col--4': institutionCount === 2 },
          { 'first-row': rowIndex === 0 },
          { 'first-col': colIndex === 0 },
          { 'last-col': colIndex === institutionCount - 1 },
          { 'has-diff': displayDiff },
          valueClassName,
        )}
      >
        {field.mapper(institution)}
      </div>
    );
  };

  return (
    <div className={className}>
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
      <div className="vads-l-row">
        <div
          className={classNames(
            { 'medium-screen:vads-l-col--12': institutionCount === 3 },
            { 'medium-screen:vads-l-col--9': institutionCount === 2 },
          )}
        >
          {fieldData.map((field, index) => {
            const rowValues = Object.keys(institutions).map(facilityCode => {
              return field.mapper(institutions[facilityCode]);
            });

            let allEqual = true;

            for (let i = 0; i < rowValues.length - 1 && allEqual; i++) {
              allEqual = _.isEqual(rowValues[i], rowValues[i + 1]);
            }

            const displayDiff = showDifferences && !allEqual;

            const columns = [
              fieldLabel(field, index, displayDiff),
              institutionFieldValue(
                field,
                index,
                0,
                institutions[facilityCodes[0]],
                displayDiff,
              ),
              institutionFieldValue(
                field,
                index,
                1,
                institutions[facilityCodes[1]],
                displayDiff,
              ),
            ];

            if (facilityCodes.length === 3) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  2,
                  institutions[facilityCodes[2]],
                  displayDiff,
                ),
              );
            }

            return (
              <div key={index} className="vads-l-row">
                {columns}
              </div>
            );
          })}
        </div>
        {facilityCodes.length === 2 && (
          <div className="medium-screen:vads-l-col--3">
            <div className="empty-col" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareGrid;
