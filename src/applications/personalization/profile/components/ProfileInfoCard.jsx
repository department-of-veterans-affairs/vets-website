import React from 'react';
import PropTypes from 'prop-types';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';
import { numberBetween } from '../../common/proptypeValidators';

const titleClassesBase = prefixUtilityClasses([
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

const rowClasses = prefixUtilityClasses([
  'border-color--gray-lighter',
  'color-gray-dark',
  'display--flex',
  'flex-direction--column',
  'padding-x--2',
  'padding-y--1p5',
]);

const rowClassesMedium = prefixUtilityClasses(['padding--4'], 'medium');

const rowTitleClasses = prefixUtilityClasses([
  'font-family--sans',
  'font-size--base',
  'font-weight--bold',
  'line-height--4',
  'margin--0',
  'margin-bottom--1',
  'width--auto',
]);

const rowTitleDescriptionClasses = prefixUtilityClasses([
  'color--gray-medium',
  'display--block',
  'font-weight--normal',
]);

const rowValueClasses = prefixUtilityClasses(['margin--0', 'width--full']);

export const profileInfoCardBaseClasses = {
  sectionTitle: [...titleClassesBase, ...titleClassesMedium, 'heading'].join(
    ' ',
  ),
  row: ['row', ...rowClasses, ...rowClassesMedium].join(' '),
  title: rowTitleClasses.join(' '),
  titleDescription: [...rowValueClasses, ...rowTitleDescriptionClasses].join(
    ' ',
  ),
  rowValue: rowValueClasses.join(' '),
};

export const CardTitle = ({ namedAnchor, children, level }) => {
  const Header = `h${level}`;
  return children ? (
    <Header
      className={profileInfoCardBaseClasses.sectionTitle}
      id={namedAnchor}
    >
      {children}
    </Header>
  ) : null;
};

CardTitle.propTypes = {
  children: PropTypes.node,
  level: numberBetween(1, 6),
  namedAnchor: PropTypes.string,
};

// need to render a single item, list of items, or a series of unrelated items as sections of each card
// dynamically chooose layout based on data type and length
// a prop for 'asList' will render as a list instead of series of unrelated items
// if a series of unrelated items, render as sections of each card
// if object, render single item

// experiment with setting heading level based on previous heading level in the DOM

// This is will replace the current ProfileInfoTable component and its main purpose is to
// provide a container for more dynamic layout of the profile information.
export const ProfileInfoCard = ({
  className,
  title,
  namedAnchor,
  level = 3,
  data,
}) => {
  const classes = {
    card: ['profile-info-card', className].join(' '),
    ...profileInfoCardBaseClasses,
  };
  return (
    <section className={classes.card}>
      <CardTitle level={level} namedAnchor={namedAnchor}>
        {title}
      </CardTitle>

      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol className="vads-u-margin--0 vads-u-padding--0" role="list">
        {data.map((row, index) => (
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

            <span className={classes.rowValue}>{row.value}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
