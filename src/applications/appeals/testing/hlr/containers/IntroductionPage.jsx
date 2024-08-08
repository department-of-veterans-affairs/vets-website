import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { formTitle, formSubTitle } from '../content/title';
import {
  introText,
  processListTitle,
  processList,
} from '../content/introduction';

import ShowAlertOrSip from '../../../shared/components/ShowAlertOrSip';

export const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  });

  const { route, location } = props;
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;

  const sipOptions = {
    // ariaDescribedby: 'main-content',
    downtime,
    formId,
    gaStartEventName: 'decision-reviews-va20-0996-start-form',
    headingLevel: 2,
    hideUnauthedStartLink: true,
    messages: savedFormMessages,
    pageList,
    pathname: '/introduction',
    prefillEnabled,
    startText: 'Start the Request for a Higher-Level Review',
    useActionLinks: true,
  };

  // const restartWizard = () => {
  //   recordEvent({ event: 'howToWizard-start-over' });
  // };

  return (
    <div className="schemaform-intro">
      <FormTitle title={formTitle} subTitle={formSubTitle} />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      {introText}

      <h2 className="vads-u-margin-top--2">{processListTitle}</h2>
      {/* <p className="vads-u-margin-top--2">
        If you don’t think this is the right form for you,{' '}
        <a
          href={`${BASE_URL}/start`}
          className="va-button-link"
          onClick={restartWizard}
        >
          go back and answer questions again
        </a>
        .
      </p> */}

      {processList}

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-y--4">
        <va-omb-info
          res-burden="15"
          omb-number="2900-0862"
          exp-date="03/31/2027"
        />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.shape({}),
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
