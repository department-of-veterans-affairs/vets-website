import React from 'react';
import PropTypes from 'prop-types';

import { prefixUtilityClasses } from '../helpers';

const ProfileInfoTable = ({
  data,
  dataTransformer,
  fieldName,
  title,
  className,
  list,
}) => {
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
  const tableRowTitleClassesMedium = prefixUtilityClasses(
    ['margin-bottom--0', 'margin-right--2'],
    'medium',
  );
  const tableRowDataClasses = prefixUtilityClasses([
    'margin--0',
    'width--full',
  ]);

  // an object where each value is a string of space-separated class names that
  // can be passed directly to a `className` attribute
  const classes = {
    table: ['profile-info-table', className].join(' '),
    title: [...titleClasses, ...titleClassesMedium].join(' '),
    tableRow: ['table-row', ...tableRowClasses, ...tableRowClassesMedium].join(
      ' ',
    ),
    tableRowTitle: [
      ...tableRowTitleClasses,
      ...tableRowTitleClassesMedium,
    ].join(' '),
    tableRowData: [...tableRowDataClasses].join(' '),
  };

  const dlAttributes = list ? { role: 'list' } : null;
  const dtAttributes = list ? { role: 'listitem' } : null;

  return (
    <section className={classes.table} data-field-name={fieldName}>
      {title && <h3 className={classes.title}>{title}</h3>}
      <dl className="vads-u-margin--0" {...dlAttributes}>
        {data
          .map(
            element => (dataTransformer ? dataTransformer(element) : element),
          )
          .map((row, index) => (
            <div key={index} className={classes.tableRow}>
              <dt className={classes.tableRowTitle} {...dtAttributes}>
                {row.title}
              </dt>
              <dd className={classes.tableRowData}>{row.value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
};

ProfileInfoTable.propTypes = {
  title: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataTransformer: PropTypes.func,
  className: PropTypes.string,
  /**
   * When `list` is truthy, additional a11y markup will be applied to the
   * rendered table to treat it like a list
   */
  list: PropTypes.bool,
};

export { prefixUtilityClasses };

export default ProfileInfoTable;
