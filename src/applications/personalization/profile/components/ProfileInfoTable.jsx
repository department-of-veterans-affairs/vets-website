import React from 'react';
import PropTypes from 'prop-types';

import { HeadingLevel, classes } from './ProfileInfoCard';

import { numberBetween } from '../../common/proptypeValidators';

const ProfileInfoTable = ({
  data,
  dataTransformer,
  title,
  className,
  namedAnchor,
  level = 3, // heading level
}) => {
  return (
    <section className={['profile-info-table', className].join(' ')}>
      {title && (
        <HeadingLevel
          namedAnchor={namedAnchor}
          level={level}
          className={classes.sectionTitle}
        >
          {title}
        </HeadingLevel>
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
              className={index === 0 ? classes.firstRow : classes.secondaryRow}
              role="listitem"
              id={row.id}
            >
              {row.title && (
                <dfn className={classes.rowTitle}>
                  {row.title}
                  {row.description && (
                    <span className={classes.rowTitleDescription}>
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
