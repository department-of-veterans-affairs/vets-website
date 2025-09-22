import React, { useState } from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { VaPrivacyAgreement } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setupPages } from '../../TaskOrange/utils/reviewPage';
import formConfig from '../form/config/form';

const ReviewPage = props => {
  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { getChapterPagesFromChapterIndex, reviewTitles } = setupPages(
    formConfig,
  );

  const { router } = props;

  const chapterClasses = [
    'vads-u-border-bottom--4px',
    'vads-u-display--flex',
    'vads-u-justify-content--space-between',
    'vads-u-align-items--flex-end',
    'vads-u-margin-bottom--2',
  ].join(' ');

  const handlers = {
    onPrivacyCheckboxChange: event => {
      setPrivacyCheckbox(event.detail);
    },
    onSubmit: () => {
      setSubmitted(true);
      if (privacyCheckbox) {
        router.push('/2');
      }
    },
  };

  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      {reviewTitles
        .filter(title => {
          return title !== 'Apply' && !title?.toLowerCase().includes('review');
        })
        .map((title, index) => {
          return (
            <div key={index}>
              {title ? (
                <div className={chapterClasses}>
                  <h3 id={index} className="vads-u-margin--0">
                    {title}
                  </h3>
                </div>
              ) : null}
              <ul className="review-pages vads-u-padding--0 usa-unstyled-list vads-u--margin-top--2">
                {getChapterPagesFromChapterIndex(index).map(page => {
                  const depends = page.depends
                    ? page.depends(props.data)
                    : true;
                  return page.review && depends
                    ? Object.entries(page.review(props)).map(
                        ([label, value]) => (
                          <li key={label}>
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
  router: PropTypes.object,
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

export default withRouter(ReviewPage);
