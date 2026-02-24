import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ProfileAlertConfirmEmail } from '@department-of-veterans-affairs/mhv/exports';

import {
  optionalNumberBetween,
  numberBetween,
} from '../../common/proptypeValidators';

const sectionTitle = classNames(['vads-u-margin--0']);

const rowTitle = classNames([
  'vads-u-font-size--h4',
  'vads-u-margin-top--0',
  'vads-u-margin-bottom--1',
]);

const rowTitleDescription = classNames([
  'vads-u-color--gray-medium',
  'vads-u-display--block',
  'vads-u-font-weight--normal',
  'vads-u-margin--0',
  'vads-u-width--full',
  'vads-u-margin-bottom--1',
  'vads-u-line-height--4',
  'vads-u-font-size--md',
]);

const rowValue = classNames([
  'vads-u-margin--0',
  'vads-u-width--full',
  'dd-privacy-mask',
]);

export const classes = {
  sectionTitle,
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
            className="vads-u-margin--0 vads-u-max-width--none"
            role="listitem"
            id={rowData.id}
          >
            <va-card
              key={index}
              id={rowData.id}
              class={classNames({ 'vads-u-border-top--0': index > 0 })}
            >
              {rowData.title && (
                <dfn
                  className={classNames(
                    classes.rowTitle,
                    'vads-u-display--block',
                  )}
                >
                  {rowData.title}
                  {rowData.alertMessage && <>{rowData.alertMessage}</>}
                  {rowData.description && (
                    <RowDescription description={rowData.description} />
                  )}
                </dfn>
              )}
              <span className={classes.rowValue}>{rowData.value}</span>
            </va-card>
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
        return (
          <va-card
            key={index}
            id={rowData.id}
            class={classNames({ 'vads-u-border-top--0': index > 0 })}
          >
            {rowData.title && (
              <>
                <HeadingLevel
                  className={classNames([classes.rowTitle])}
                  level={level}
                >
                  {rowData.title}
                </HeadingLevel>
                {rowData.alertMessage && <>{rowData.alertMessage}</>}
                {rowData.description && (
                  <RowDescription description={rowData.description} />
                )}
              </>
            )}

            {rowData?.value && (
              <div className={classes.rowValue}>{rowData.value}</div>
            )}
          </va-card>
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
export const ProfileInfoSection = ({
  className,
  title,
  namedAnchor,
  level = 3,
  data,
  asList = false,
  enableAlertConfirmEmail = false,
}) => {
  const secondaryLevel = level + 1;

  return (
    <section className={classNames(['profile-info-section', className])}>
      <HeadingLevel
        level={level}
        namedAnchor={namedAnchor}
        className={classes.sectionTitle}
      >
        {title}
      </HeadingLevel>

      {enableAlertConfirmEmail && <ProfileAlertConfirmEmail />}

      <div className="vads-u-margin-top--1">
        {Array.isArray(data) ? (
          <ListOrSections data={data} asList={asList} level={secondaryLevel} />
        ) : (
          <va-card>{data}</va-card>
        )}
      </div>
    </section>
  );
};

ProfileInfoSection.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.node])
    .isRequired,
  asList: PropTypes.bool,
  className: PropTypes.string,
  enableAlertConfirmEmail: PropTypes.bool,
  level: optionalNumberBetween(1, 5),
  namedAnchor: PropTypes.string,
  title: PropTypes.string,
};
