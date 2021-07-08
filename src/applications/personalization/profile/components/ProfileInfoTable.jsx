import React from 'react';
import PropTypes from 'prop-types';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';
import { numberBetween } from '../../common/proptypeValidators';

const titleClasses = prefixUtilityClasses([
  'background-color--gray-lightest',
  'border--1px',
  'border-color--gray-lighter',
  'color--gray-darkest',
  'margin--0',
  'padding-x--2',
  'padding-y--1p5',
  'font-size--h3',
]);
const titleClassesMedium = prefixUtilityClasses(
  ['padding-x--4', 'padding-y--2'],
  'medium',
);
const titleClassesCombined = [
  ...titleClasses,
  ...titleClassesMedium,
  'heading',
].join(' ');

const TableTitle = ({ namedAnchor, children, level }) => {
  const Header = `h${level}`;
  return (
    <Header className={titleClassesCombined} id={namedAnchor}>
      {children}
    </Header>
  );
};

const ProfileInfoTable = ({
  data,
  dataTransformer,
  title,
  className,
  namedAnchor,
  level = 3, // heading level
}) => {
  // TODO: move all these class var outside of the component so they aren't
  // recomputed on every render
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

  const tableRowValueClasses = prefixUtilityClasses([
    'margin--0',
    'width--full',
  ]);

  const tableRowValueClassesMedium = prefixUtilityClasses(
    ['padding-left--5'],
    'medium',
  );

  const dataContainsVerified = data.some(row => row.verified === true);

  // When a table includes a 'Verified' checkmark in any of its rows, we need to add left padding to its values
  // so that the data lines up correctly
  const computedTableRowValueClasses = dataContainsVerified
    ? [...tableRowValueClasses, ...tableRowValueClassesMedium].join(' ')
    : [...tableRowValueClasses].join(' ');

  // an object where each value is a string of space-separated class names that
  // can be passed directly to a `className` attribute
  const classes = {
    table: ['profile-info-table', className].join(' '),
    tableRow: ['table-row', ...tableRowClasses, ...tableRowClassesMedium].join(
      ' ',
    ),
    tableRowTitle: [
      ...tableRowTitleClasses,
      ...tableRowTitleClassesMedium,
    ].join(' '),
  };

  return (
    <section className={classes.table}>
      {title && (
        <TableTitle namedAnchor={namedAnchor} level={level}>
          {title}
        </TableTitle>
      )}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol className="vads-u-margin--0 vads-u-padding--0" role="list">
        {data
          .map(
            element => (dataTransformer ? dataTransformer(element) : element),
          )
          .map((row, index) => (
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <li
              key={index}
              className={classes.tableRow}
              role="listitem"
              id={row.id}
            >
              {row.title && (
                <dfn className={classes.tableRowTitle}>{row.title}</dfn>
              )}

              {/* In Account Security, we have some rows that need a checkmark when verified  */}
              {row.verified && row.value}

              {!row.verified && (
                <span className={computedTableRowValueClasses}>
                  {row.value}
                </span>
              )}
            </li>
          ))}
      </ol>
    </section>
  );
};

ProfileInfoTable.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  dataTransformer: PropTypes.func,
  className: PropTypes.string,
  namedAnchor: PropTypes.string,
  level: numberBetween(1, 6),
};

export default ProfileInfoTable;
