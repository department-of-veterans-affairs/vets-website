import React from 'react';
import PropTypes from 'prop-types';

import {
  CardTitle as TableTitle,
  profileInfoCardBaseClasses,
} from './ProfileInfoCard';

import { numberBetween } from '../../common/proptypeValidators';

const ProfileInfoTable = ({
  data,
  dataTransformer,
  title,
  className,
  namedAnchor,
  level = 3, // heading level
}) => {
  // an object where each value is a string of space-separated class names that
  // can be passed directly to a `className` attribute
  const classes = {
    table: ['profile-info-table', className].join(' '),
    ...profileInfoCardBaseClasses,
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
            <li key={index} className={classes.row} role="listitem" id={row.id}>
              {row.title && (
                <dfn className={classes.title}>
                  {row.title}
                  {row.description && (
                    <span className={classes.titleDescription}>
                      {row.description}
                    </span>
                  )}
                  {row.alertMessage && <>{row.alertMessage}</>}
                </dfn>
              )}

              {/* In Account Security, we have some rows that need a checkmark when verified  */}
              {row.verified && row.value}

              {!row.verified && (
                <span className={classes.rowValue}>{row.value}</span>
              )}
            </li>
          ))}
      </ol>
    </section>
  );
};

ProfileInfoTable.propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  dataTransformer: PropTypes.func,
  level: numberBetween(1, 6),
  namedAnchor: PropTypes.string,
  title: PropTypes.string,
};

export default ProfileInfoTable;
