/**
 *  NOTE: This is a work in progress. It will be updated.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { introParagraph, ombInfo, route, whatToKnow = [] } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    focusElement('.usa-breadcrumb__list');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} />
      <p>{introParagraph}</p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        What to know before you fill out this form
      </h2>
      <div className="process schemaform-process">
        <ul>
          {whatToKnow.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      </div>
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the Application"
        hideUnauthedStartLink
      />
      <p />
      {ombInfo && (
        <va-omb-info
          data-testid="va-omb-info"
          exp-date={ombInfo.expDate}
          omb-number={ombInfo.ombNumber}
          res-burden={ombInfo.resBurden}
        >
          <p>
            <strong>The Paperwork Reduction Act</strong> of 1995 requires us to
            notify you that this information...
          </p>
          <p>
            <strong>Privacy Act information:</strong> VA is asking you to
            provide the information...
          </p>
        </va-omb-info>
      )}
    </article>
  );
};

IntroductionPage.propTypes = {
  introParagraph: PropTypes.string,
  ombInfo: PropTypes.shape({
    expDate: PropTypes.string,
    ombNumber: PropTypes.string,
    resBurden: PropTypes.number,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      title: PropTypes.string,
    }),
    pageList: PropTypes.array,
  }),
  whatToKnow: PropTypes.arrayOf(PropTypes.string),
};

export default IntroductionPage;
