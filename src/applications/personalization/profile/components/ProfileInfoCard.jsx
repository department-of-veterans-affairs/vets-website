import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  optionalNumberBetween,
  numberBetween,
} from '../../common/proptypeValidators';

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
  'vads-u-width--auto',
]);

const rowTitleDescription = classNames([
  'vads-u-color--gray-medium',
  'vads-u-display--block',
  'vads-u-font-weight--normal',
  'vads-u-margin--0',
  'vads-u-width--full',
  'vads-u-margin-bottom--1',
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

const RowDescription = ({ description }) => (
  <span className={classes.rowTitleDescription}>{description} </span>
);

RowDescription.propTypes = {
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
};

export const List = ({ data }) => {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol className="vads-u-margin--0 vads-u-padding--0" role="list">
        {data.map((rowData, index) => (
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
                  <RowDescription description={rowData.description} />
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
  data: PropTypes.array.isRequired,
};

const Sections = ({ data, level }) => {
  return (
    <>
      {data.map((rowData, index) => {
        // heading should only have bottom margin when there is no description
        const rowHeadingClasses = classNames([
          classes.rowTitle,
          {
            'vads-u-margin-bottom--1': !rowData?.description,
          },
        ]);
        return (
          <div
            key={index}
            className={index === 0 ? classes.firstRow : classes.secondaryRow}
            id={rowData.id}
          >
            {rowData.title && (
              <>
                <HeadingLevel className={rowHeadingClasses} level={level}>
                  {rowData.title}
                </HeadingLevel>
                {rowData.description && (
                  <RowDescription description={rowData.description} />
                )}
                {rowData.alertMessage && <>{rowData.alertMessage}</>}
              </>
            )}

            {rowData?.value && (
              <div className={classes.rowValue}>{rowData.value}</div>
            )}
          </div>
        );
      })}
    </>
  );
};

Sections.propTypes = {
  ...List.propTypes,
  level: numberBetween(1, 6),
};

const ListOrSections = ({ data, asList, level }) => {
  return asList ? <List data={data} /> : <Sections data={data} level={level} />;
};

ListOrSections.propTypes = {
  ...List.propTypes,
  ...Sections.propTypes,
};

// render a list of items, sections of items, or a single item
// 'asList' as true, will render as an ordered list instead of series of sections (legacy behavior)
// if single item is passed as data, it will be rendered as is (passing single node)
export const ProfileInfoCard = ({
  className,
  title,
  namedAnchor,
  level = 3,
  data,
  asList = false,
}) => {
  const secondaryLevel = level + 1;

  return (
    <section className={classNames(['profile-info-card', className])}>
      <HeadingLevel
        level={level}
        namedAnchor={namedAnchor}
        className={classes.sectionTitle}
      >
        {title}
      </HeadingLevel>

      {Array.isArray(data) ? (
        <ListOrSections data={data} asList={asList} level={secondaryLevel} />
      ) : (
        <div className={classes.firstRow}>{data}</div>
      )}
    </section>
  );
};

ProfileInfoCard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.node])
    .isRequired,
  asList: PropTypes.bool,
  className: PropTypes.string,
  level: optionalNumberBetween(1, 5),
  namedAnchor: PropTypes.string,
  title: PropTypes.string,
};
