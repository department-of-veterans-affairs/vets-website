import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { numberBetween } from '../../common/proptypeValidators';

const sectionTitle = classNames([
  'heading',
  'vads-u-background-color--gray-lightest',
  'vads-u-border-color--gray-lighter',
  'vads-u-color--gray-darkest',
  'vads-u-border-top--1px',
  'vads-u-border-left--1px',
  'vads-u-border-right--1px',
  'vads-u-margin--0',
  'vads-u-padding-x--2',
  'vads-u-padding-y--1p5',
  'vads-u-font-size--h3',
  'medium-screen:vads-u-padding-x--4',
  'medium-screen:vads-u-padding-y--2',
]);

const row = classNames([
  'row',
  'vads-u-border-color--gray-lighter',
  'vads-u-color-gray-dark',
  'vads-u-display--flex',
  'vads-u-flex-direction--column',
  'vads-u-padding-x--2',
  'vads-u-padding-y--1p5',
  'medium-screen:vads-u-padding--4',
]);

const firstRow = classNames([row, 'vads-u-border--1px']);

const secondaryRow = classNames([
  row,
  'vads-u-border-top--0px',
  'vads-u-border-left--1px',
  'vads-u-border-right--1px',
  'vads-u-border-bottom--1px',
]);

const rowTitle = classNames([
  'vads-u-font-family--sans',
  'vads-u-font-size--base',
  'vads-u-font-weight--bold',
  'vads-u-line-height--4',
  'vads-u-margin--0',
  'vads-u-margin-bottom--1',
  'vads-u-width--auto',
]);

const rowTitleDescription = classNames([
  'vads-u-color--gray-medium',
  'vads-u-display--block',
  'vads-u-font-weight--normal',
  'vads-u-margin--0',
  'vads-u-width--full',
]);

const rowValue = classNames(['vads-u-margin--0', 'vads-u-width--full']);

export const classes = {
  sectionTitle,
  firstRow,
  secondaryRow,
  row,
  rowTitle,
  rowTitleDescription,
  rowValue,
};

export const HeadingLevel = ({ namedAnchor, children, level, className }) => {
  const Header = `h${level}`;
  return children ? (
    <Header className={className} id={namedAnchor}>
      {children}
    </Header>
  ) : null;
};

HeadingLevel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  level: numberBetween(1, 6),
  namedAnchor: PropTypes.string,
};

export const List = ({ rows }) => {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol className="vads-u-margin--0 vads-u-padding--0" role="list">
        {rows.map((rowData, index) => (
          // eslint-disable-next-line jsx-a11y/no-redundant-roles
          <li
            key={index}
            className={index === 0 ? classes.firstRow : classes.secondaryRow}
            role="listitem"
            id={rowData.id}
          >
            {rowData.title && (
              <dfn className={classes.rowTitle}>
                {rowData.title}
                {rowData.description && (
                  <span className={classes.rowTitleDescription}>
                    {rowData.description}
                  </span>
                )}
                {rowData.alertMessage && <>{rowData.alertMessage}</>}
              </dfn>
            )}

            <span className={classes.rowValue}>{rowData.value}</span>
          </li>
        ))}
      </ol>
    </>
  );
};

List.propTypes = {
  rows: PropTypes.array.isRequired,
};

const Sections = ({ rows, level }) => {
  return (
    <>
      {rows.map((rowData, index) => (
        <div
          key={index}
          className={index === 0 ? classes.firstRow : classes.secondaryRow}
          id={rowData.id}
        >
          {rowData.title && (
            <HeadingLevel className={classes.rowTitle} level={level}>
              {rowData.title}
              {rowData.description && (
                <span className={classes.rowTitleDescription}>
                  {rowData.description}
                </span>
              )}
              {rowData.alertMessage && <>{rowData.alertMessage}</>}
            </HeadingLevel>
          )}

          {rowData?.value && (
            <span className={classes.rowValue}>{rowData.value}</span>
          )}
        </div>
      ))}
    </>
  );
};

Sections.propTypes = {
  ...List.propTypes,
  level: numberBetween(1, 6),
};

const ContentRepeater = ({ data, asList, level }) => {
  return asList ? <List rows={data} /> : <Sections rows={data} level={level} />;
};

ContentRepeater.propTypes = {
  ...List.propTypes,
  ...Sections.propTypes,
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
  asList = false,
}) => {
  const secondaryLevel = level + 1;

  const content = Array.isArray(data) ? (
    <ContentRepeater data={data} asList={asList} level={secondaryLevel} />
  ) : (
    <>{data}</>
  );

  return (
    <section className={classNames(['profile-info-card', className])}>
      <HeadingLevel
        level={level}
        namedAnchor={namedAnchor}
        className={classes.sectionTitle}
      >
        {title}
      </HeadingLevel>
      {content}
    </section>
  );
};

ProfileInfoCard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.node])
    .isRequired,
  asList: PropTypes.bool,
  className: PropTypes.string,
  level: numberBetween(1, 5),
  namedAnchor: PropTypes.string,
  title: PropTypes.string,
};
