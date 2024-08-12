import React, { useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { setupPages } from '../utils/taskListPages';

const ReviewPage = props => {
  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { chapterTitles, getChapterPagesFromChapterIndex } = setupPages();
  const chapterClasses = [
    'vads-u-border-bottom--1px',
    'vads-u-border-color--gray-lightest',
    'vads-u-display--flex',
    'vads-u-justify-content--space-between',
    'vads-u-align-items--flex-end',
  ].join(' ');

  const handlers = {
    onPrivacyCheckboxChange: event => {
      setPrivacyCheckbox(event.detail);
    },
    onSubmit: () => {
      setSubmitted(true);
      if (privacyCheckbox) {
        props.goToPath('/confirmation');
      }
    },
  };

  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <h1>Review Board Appeal</h1>
      <va-on-this-page uswds />
      {chapterTitles.filter(title => title !== 'Apply').map((title, index) => {
        const pages = getChapterPagesFromChapterIndex(index);
        const editLink =
          pages.find(page => !page.taskListHide)?.path || '/task-list';
        return (
          <div key={index}>
            <div className={chapterClasses}>
              <h2 id={index} className="vads-u-margin--0">
                {title}
              </h2>
              <Link to={editLink}>Edit</Link>
            </div>
            <ul className="review-pages vads-u-padding--0">
              {getChapterPagesFromChapterIndex(index).map(page => {
                const depends = page.depends ? page.depends(props.data) : true;
                return page.review && depends
                  ? Object.entries(page.review(props.data)).map(
                      ([label, value]) => (
                        <li key={label}>
                          <div className="page-title vads-u-margin-top--1 vads-u-color--gray">
                            {label}
                          </div>
                          <div className="page-value">{value}</div>
                        </li>
                      ),
                    )
                  : null;
              })}
            </ul>
          </div>
        );
      })}
      <p className="vads-u-margin-top--6">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
      <VaPrivacyAgreement
        onVaChange={handlers.onPrivacyCheckboxChange}
        showError={submitted && !privacyCheckbox}
        uswds
      />
      <p className="vads-u-margin-top--4">
        <Link to="review-then-submit2">Finish this application later</Link>
      </p>
      {/* {props.contentBeforeButtons} */}
      <va-button onClick={handlers.onSubmit} text="Submit" uswds />
      <FormNavButtons goBack={props.goBack} goForward={handlers.onSubmit} />
      {/* {props.contentAfterButtons} */}
    </article>
  );
};

ReviewPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
    }).isRequired,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  name: PropTypes.string,
  pagePerItemIndex: PropTypes.number,
  schema: PropTypes.shape({}),
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  uiSchema: PropTypes.shape({}),
  updatePage: PropTypes.func,
  uploadFile: PropTypes.func,
  onChange: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default ReviewPage;
