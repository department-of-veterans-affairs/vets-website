import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const isReactComponent = component => {
  return (
    component &&
    (typeof component === 'function' ||
      (component.$$typeof &&
        component.$$typeof.toString().includes('Symbol(react')))
  );
};

const WarningBadge = ({ children }) => (
  <small className="vads-u-background-color--gold-lighter vads-u-padding-x--1 vads-u-padding-y--0p25 vads-u-margin-left--1 vads-u-border--1px vads-u-border-color--gold">
    {children}
  </small>
);

const PageAnalysis = ({ page, pageName, urlPrefix }) => {
  const formData = useSelector(state => state?.form?.data || {});
  const hasCustomPage = isReactComponent(page?.CustomPage);
  const hasCustomPageReview = isReactComponent(page?.CustomPageReview);
  const hasUiSchema = page?.uiSchema && Object.keys(page?.uiSchema).length > 0;
  const showWarning = (hasCustomPage || hasCustomPageReview) && hasUiSchema;

  const depends = page?.depends;
  const hasDepends = !!depends;
  const isVisible = !!(
    depends &&
    typeof depends === 'function' &&
    depends(formData)
  );

  const path = `${urlPrefix}${page.path}`;

  return (
    <li className="vads-u-margin-y--0">
      <small className="vads-u-display--flex vads-u-align-items--center vads-u-flex-wrap--wrap">
        <Link
          to={path}
          className="vads-u-text-decoration--none vads-u-color--primary vads-u-padding-x--0p5"
          activeClassName="active vads-u-background-color--primary-alt-lightest"
        >
          <span className="vads-u-font-size--sm">
            {page.title ? page.title : `${pageName}: no title`}
          </span>
        </Link>

        {hasDepends &&
          (isVisible ? (
            <va-icon icon="visibility" />
          ) : (
            <va-icon icon="visibility_off" />
          ))}
        {(hasCustomPage || hasCustomPageReview || showWarning) && (
          <>
            {hasCustomPage && (
              <span className="vads-u-margin-left--0p25">
                [CustomPage
                {hasCustomPageReview && '+Review'}]
              </span>
            )}

            {showWarning && (
              <WarningBadge>Warning: uiSchema may be ignored</WarningBadge>
            )}
          </>
        )}
      </small>
    </li>
  );
};

const ChapterAnalyzer = ({ formConfig, urlPrefix }) => {
  if (!formConfig?.chapters) {
    return (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--1">
        No chapters or form config found
      </div>
    );
  }

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--1">
      <p className="vads-u-margin-y--0 vads-u-font-size--sm">Form Structure</p>
      <div className="vads-u-margin-y--0p5">
        {Object.entries(formConfig.chapters).map(([chapterKey, chapter]) => (
          <div
            key={chapterKey}
            className="vads-u-margin-bottom--1 vads-u-background-color--white vads-u-padding--1"
          >
            <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--0p25 vads-u-font-size--h5">
              {chapter?.title || chapterKey}
            </h4>
            <ul className="vads-u-margin--0">
              {chapter?.pages &&
                Object.entries(chapter.pages).map(([pageKey, page]) => (
                  <PageAnalysis
                    key={pageKey}
                    page={page}
                    pageName={pageKey}
                    urlPrefix={urlPrefix}
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

ChapterAnalyzer.propTypes = {
  formConfig: PropTypes.shape({
    chapters: PropTypes.object.isRequired,
  }),
  urlPrefix: PropTypes.string,
};

PageAnalysis.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string,
    path: PropTypes.string,
    depends: PropTypes.func,
    CustomPage: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    CustomPageReview: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    uiSchema: PropTypes.object,
  }).isRequired,
  pageName: PropTypes.string.isRequired,
  urlPrefix: PropTypes.string,
};

WarningBadge.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChapterAnalyzer;
