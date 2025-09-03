import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom-v5-compat';
import { connect, useSelector } from 'react-redux';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { getFormattedAppointmentDate } from '../utils';

import { useDatadogRum } from '../hooks/useDatadogRum';

import BreadCrumb from '../components/BreadCrumb';
import MoreInformation from '../components/MoreInformation';
import AvsPageHeader from '../components/AvsPageHeader';
import YourAppointment from '../components/YourAppointment';
import YourHealthInformation from '../components/YourHealthInformation';
import YourTreatmentPlan from '../components/YourTreatmentPlan';
import AvsErrorElement from '../components/AvsErrorElement';

import type { AvsProps, AvsData } from '../types';

interface StateToProps {
  isLoggedIn: boolean;
}

interface FeatureTogglesState {
  loading: boolean;
  [key: string]: any; // Use string index signature instead of computed property
}

interface RootState {
  user: {
    login: {
      currentlyLoggedIn: boolean;
    };
  };
  featureToggles: FeatureTogglesState;
}

const generateAppointmentHeader = (avs: AvsData): string => {
  const appointmentDate = getFormattedAppointmentDate(avs);
  return `Your appointment on ${appointmentDate}`;
};

const Avs: React.FC<AvsProps & StateToProps> = ({ id, isLoggedIn }) => {
  useDatadogRum();

  const user = useSelector(selectUser);
  const { avsEnabled, featureTogglesLoading } = useSelector(
    (state: RootState) => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        avsEnabled: state.featureToggles[FEATURE_FLAG_NAMES.avsEnabled as keyof FeatureTogglesState],
      };
    },
  );

  const loader = useLoaderData() as { avs: Promise<AvsData> };

  if (avsEnabled === false) {
    window.location.replace('/');
    return null;
  }

  const loadingIndicator = (
    <va-loading-indicator
      data-testid="avs-loading-indicator"
      message="Loading your after-visit summary"
    />
  );

  if (isLoggedIn && (!loader.avs || featureTogglesLoading)) {
    return loadingIndicator;
  }

  if (!id) {
    window.location.replace('/my-health/medical-records/summaries-and-notes/');
    return null;
  }

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <Suspense fallback={loadingIndicator}>
        <Await resolve={loader.avs} errorElement={<AvsErrorElement />}>
          {(avs: AvsData) => (
            <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 main-content">
              <BreadCrumb />
              <h1 className="vads-u-padding-top--2">After-visit summary</h1>
              {avs.meta?.pageHeader && (
                <p>
                  <AvsPageHeader text={avs.meta.pageHeader} />
                </p>
              )}

              <va-accordion uswds>
                <va-accordion-item
                  header={generateAppointmentHeader(avs)}
                  open="true"
                  uswds
                >
                  <YourAppointment avs={avs} />
                </va-accordion-item>
                <va-accordion-item
                  header="Your treatment plan from this appointment"
                  uswds
                >
                  <YourTreatmentPlan avs={avs} />
                </va-accordion-item>
                <va-accordion-item
                  header="Your health information as of this appointment"
                  uswds
                >
                  <YourHealthInformation avs={avs} />
                </va-accordion-item>
                <va-accordion-item header="More information" uswds>
                  <MoreInformation avs={avs} />
                </va-accordion-item>
              </va-accordion>
            </div>
          )}
        </Await>
      </Suspense>
    </RequiredLoginView>
  );
};

const mapStateToProps = (state: RootState): StateToProps => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export { Avs };
export default connect<StateToProps, {}, AvsProps, RootState>(mapStateToProps)(Avs as any);