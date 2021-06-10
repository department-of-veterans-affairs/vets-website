import React from 'react';
import classNames from 'classnames';

export function CompareGrid({
  sectionLabel,
  sectionSublabel,
  facilityCodes,
  institutions,
  fieldData,
}) {
  const institutionCount = Object.keys(institutions).length;
  const fieldLabel = (field, index) => {
    return (
      <div
        key={`${index}-label`}
        className={classNames(
          'field-label',
          { 'medium-screen:vads-l-col--3': institutionCount === 3 },
          { 'medium-screen:vads-l-col--4': institutionCount === 2 },
        )}
      >
        <div className={classNames('label-cell', { first: index === 0 })}>
          {field.label}
        </div>
      </div>
    );
  };

  const institutionFieldValue = (field, rowIndex, colIndex, institution) => {
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
          { [field.className]: field.className },
        )}
      >
        {field.mapper(institution)}
      </div>
    );
  };

  return (
    <div>
      {sectionLabel && (
        <div className="compare-header-section">{sectionLabel}</div>
      )}
      {sectionSublabel && (
        <div
          className={classNames('compare-header-subsection', {
            'vads-u-margin-top--4': !sectionLabel,
          })}
        >
          {sectionSublabel}
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
            const columns = [
              fieldLabel(field, index),
              institutionFieldValue(
                field,
                index,
                0,
                institutions[facilityCodes[0]],
              ),
              institutionFieldValue(
                field,
                index,
                1,
                institutions[facilityCodes[1]],
              ),
            ];

            if (facilityCodes.length === 3) {
              columns.push(
                institutionFieldValue(
                  field,
                  index,
                  2,
                  institutions[facilityCodes[2]],
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
