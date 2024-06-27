import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { PageTitle } from '../content/title';
import { IntroText, ProcessList, OmbBlock } from '../content/introduction';

import ShowAlertOrSip from '../../shared/components/ShowAlertOrSip';

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

  return (
    <div className="schemaform-intro">
      <PageTitle longTitle />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      <IntroText />
      <ProcessList />

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <OmbBlock />
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
