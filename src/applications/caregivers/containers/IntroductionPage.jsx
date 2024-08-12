import React, { useCallback, useEffect } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import CaregiversPrivacyActStatement from '../components/IntroductionPage/CaregiversPrivacyActStatement';
import ProcessTimeline from '../components/IntroductionPage/ProcessTimeline';
import content from '../locales/en/content.json';

export const IntroductionPage = props => {
  const { route, router } = props;

  const startForm = useCallback(
    () => {
      recordEvent({ event: 'caregivers-10-10cg-start-form' });
      const { pageList } = route;
      return router.push(pageList[1].path);
    },
    [route, router],
  );

  const startBtn = (
    <a href="#start" className="vads-c-action-link--green" onClick={startForm}>
      {content['button-start-app']}
    </a>
  );

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="caregivers-intro schemaform-intro">
      <DowntimeNotification
        appTitle={content['app-title']}
        dependencies={[externalServices.mvi, externalServices.carma]}
      >
        <FormTitle
          title={content['app-title']}
          subTitle={content['app-subtitle']}
          className="form-title"
        />
        <p className="va-introtext">{content['app-intro']}</p>

        {startBtn}

        <ProcessTimeline />

        {startBtn}

        <va-omb-info
          res-burden={15}
          omb-number="2900-0768"
          exp-date="04/30/2024"
          class="omb-info--container vads-u-padding-left--0 vads-u-margin-top--4"
        >
          <CaregiversPrivacyActStatement />
        </va-omb-info>
      </DowntimeNotification>
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
  router: PropTypes.object,
};

export default withRouter(IntroductionPage);
