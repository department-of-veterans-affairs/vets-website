import React, { useCallback, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import CaregiversPrivacyActStatement from '../components/IntroductionPage/CaregiversPrivacyActStatement';
import ProcessTimeline from '../components/IntroductionPage/ProcessTimeline';
import { appTitle, appSubtitle, appIntro } from '../definitions/content';

export const IntroductionPage = ({
  route,
  router,
  formData,
  setFormData,
  useFacilitiesAPI,
}) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  useEffect(
    () => {
      setFormData({
        ...formData,
        'view:useFacilitiesAPI': useFacilitiesAPI,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useFacilitiesAPI],
  );

  const startForm = useCallback(
    () => {
      recordEvent({ event: 'caregivers-10-10cg-start-form' });
      const { pageList } = route;
      return router.push(pageList[1].path);
    },
    [route, router],
  );

  return (
    <div className="caregivers-intro schemaform-intro">
      <DowntimeNotification
        appTitle={appTitle}
        dependencies={[externalServices.mvi, externalServices.carma]}
      >
        <FormTitle title={appTitle} className="form-title" />
        <p>{appSubtitle}</p>
        <p className="va-introtext">{appIntro}</p>

        <a
          href="#start"
          className="vads-c-action-link--green"
          onClick={startForm}
        >
          Start your application
        </a>

        <ProcessTimeline />

        <a
          href="#start"
          className="vads-c-action-link--green"
          onClick={startForm}
        >
          Start your application
        </a>

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
  formData: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  useFacilitiesAPI: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  useFacilitiesAPI: state.featureToggles?.caregiverUseFacilitiesApi,
});

const mapDispatchToProps = {
  setFormData: setData,
};

const introPageWithRouter = withRouter(IntroductionPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(introPageWithRouter);
