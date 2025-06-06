import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';

import { PageTitle } from '../content/title';
import {
  IntroText,
  ProcessList,
  OmbBlock,
  OtherBenefits,
} from '../content/introduction';

import ShowAlertOrSip from '../../shared/components/ShowAlertOrSip';

export const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
    scrollTo('topContentElement');
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
    <div className="schemaform-intro vads-u-margin-bottom--4">
      <PageTitle />
      <IntroText />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      <ProcessList />

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <OmbBlock />
      <OtherBenefits />
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
