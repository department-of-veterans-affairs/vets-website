import React, { useState } from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaPrivacyAgreement,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setupPages } from '../../utils/reviewPage';
import { formConfigForOrangeTask } from '../../config/form';

const ReviewPage = props => {
  const { location } = props;
  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { chapterTitles, getChapterPagesFromChapterIndex } = setupPages(
    formConfigForOrangeTask,
  );

  const chapterClasses = [
    'vads-u-border-bottom--4px',
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
        props.goToPath('/2/task-orange/complete');
      }
    },
    onBack: () => {
      props.goBack();
    },
  };

  return (
    <article>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      {chapterTitles
        .filter(title => {
          return title !== 'Apply' && !title.toLowerCase().includes('review');
        })
        .map((title, index) => {
          return (
            <div key={index}>
              <div className={chapterClasses}>
                <h3
                  id={index}
                  className="vads-u-margin--0 vads-u-font-size--h3"
                >
                  {title}
                </h3>
              </div>

              {getChapterPagesFromChapterIndex(index).map(page => {
                const depends = page.depends
                  ? page.depends({ ...props.data, location })
                  : true;
                return page.review && depends
                  ? Object.entries(page.review(props)).map(([label, value]) => (
                      <div className="page-value" key={label}>
                        {value}
                      </div>
                    ))
                  : null;
              })}
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
      <VaButtonPair
        class="vads-u-margin-top--2"
        continue
        onPrimaryClick={handlers.onSubmit}
        onSecondaryClick={handlers.onBack}
      />
      {/* {props.contentAfterButtons} */}
    </article>
  );
};

ReviewPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  location: PropTypes.object,
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

export default withRouter(ReviewPage);
