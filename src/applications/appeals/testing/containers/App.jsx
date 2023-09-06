import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import formConfig from '../config/form';

import { setupPages } from '../utils/taskListPages';

export default function App(props) {
  const { location, children } = props;
  const { chapterTitles, findPageFromPath } = setupPages(formConfig);
  const currentPath = location.pathname;
  const { chapterIndex } = findPageFromPath(currentPath);

  const noHeader = ['/introduction', '/task-list', '/confirmation'];

  const goBack = e => {
    e.preventDefault();
    // Click the hidden back button
    document
      .querySelector('.form-progress-buttons .usa-button-secondary')
      .click();
  };

  return (
    <article
      id="appeals-testing"
      data-location={`${location?.pathname?.slice(1)}`}
    >
      {!noHeader.includes(currentPath) && (
        <>
          <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--2">
            <div className="row">
              <div className="usa-width-two-thirds medium-8 columns">
                <strong>{formConfig.title} (VA Form 10182)</strong>
              </div>
            </div>
          </div>
          <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--2">
            <div className="row">
              <div className="usa-width-two-thirds medium-8 columns">
                <div className="vads-u-display--flex">
                  <div>&#x2190;&#x00a0;</div>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className="vads-u-padding-right--1p5"
                    onClick={goBack}
                  >
                    Back
                  </a>
                  <span role="presentation" className="vads-u-padding-x--1p5">
                    |
                  </span>
                  <Link
                    to={{ pathname: '/task-list', search: '?redirect' }}
                    className="vads-u-padding-x--1p5"
                  >
                    Task List
                  </Link>
                  <span role="presentation" className="vads-u-padding-x--1p5">
                    |
                  </span>
                  <a
                    href="/decision-reviews/appeals-testing/"
                    className="vads-u-padding-x--1p5"
                  >
                    Exit form
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="usa-width-two-thirds medium-8 columns vads-u-margin-top--2">
              <va-segmented-progress-bar
                current={chapterIndex + 1}
                heading-text={chapterTitles[chapterIndex]}
                label="Label is here"
                labels={chapterTitles.join(';')}
                total={chapterTitles.length}
                uswds
              />
            </div>
          </div>
        </>
      )}
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">{children}</div>
      </div>
    </article>
  );
}

App.propTypes = {
  children: PropTypes.any,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
