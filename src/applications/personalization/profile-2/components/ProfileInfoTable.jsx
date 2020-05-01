import React from 'react';
import PropTypes from 'prop-types';

import { prefixUtilityClasses } from '../helpers';

const ProfileInfoTable = ({
  data,
  dataTransformer,
  fieldName,
  title,
  className,
}) => {
  const tableClasses = ['profile-info-table', className];
  const titleClasses = prefixUtilityClasses([
    'background-color--gray-lightest',
    'border--1px',
    'border-color--gray-lighter',
    'color--gray-darkest',
    'margin--0',
    'padding-x--2',
    'padding-y--1p5',
  ]);
  const titleClassesMedium = prefixUtilityClasses(
    ['padding-x--3', 'padding-y--2'],
    'medium',
  );
  const tableRowClasses = prefixUtilityClasses([
    'border-color--gray-lighter',
    'color-gray-dark',
    'display--flex',
    'flex-direction--column',
    'padding-x--2',
    'padding-y--1p5',
  ]);
  const tableRowClassesMedium = prefixUtilityClasses(
    ['flex-direction--row', 'padding--4'],
    'medium',
  );
  const tableRowTitleClasses = prefixUtilityClasses([
    'font-family--sans',
    'font-size--base',
    'font-weight--bold',
    'line-height--4',
    'margin--0',
    'margin-bottom--1',
  ]);
  const tableRowTitleMediumClasses = prefixUtilityClasses(
    ['margin-bottom--0', 'margin-right--2'],
    'medium',
  );
  const tableRowDataClasses = ['vads-u-margin--0'];

  return (
    <div className={tableClasses.join(' ')} data-field-name={fieldName}>
      {title && (
        <h3 className={[...titleClasses, ...titleClassesMedium].join(' ')}>
          {title}
        </h3>
      )}
      <dl className="vads-u-margin--0">
        {data
          .map(
            element => (dataTransformer ? dataTransformer(element) : element),
          )
          .map((row, index) => (
            <div
              key={index}
              className={`table-row ${[
                ...tableRowClasses,
                ...tableRowClassesMedium,
              ].join(' ')}`}
            >
              <dt
                className={[
                  ...tableRowTitleClasses,
                  ...tableRowTitleMediumClasses,
                ].join(' ')}
              >
                {row.title}
              </dt>
              <dd className={tableRowDataClasses.join(' ')}>{row.value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
};

ProfileInfoTable.propTypes = {
  title: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataTransformer: PropTypes.func,
  className: PropTypes.string,
};

export { prefixUtilityClasses };

export default ProfileInfoTable;
