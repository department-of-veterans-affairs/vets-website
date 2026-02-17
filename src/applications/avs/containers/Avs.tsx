import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom-v5-compat';
import { connect, useSelector } from 'react-redux';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import {
  VaLoadingIndicator,
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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

interface RootState {
  user: {
    login: {
      currentlyLoggedIn: boolean;
    };
  };
}

const generateAppointmentHeader = (avs: AvsData): string => {
  const appointmentDate = getFormattedAppointmentDate(avs);
  return `Your appointment on ${appointmentDate}`;
};

const Avs: React.FC<AvsProps & StateToProps> = ({ id, isLoggedIn }) => {
  useDatadogRum();

  const user = useSelector(selectUser) as Record<string, unknown>;

  // Use the feature toggle hook with proper typing from platform
  const { useToggleValue, useToggleLoadingValue, TOGGLE_NAMES } =
    useFeatureToggle();
  const avsEnabled = useToggleValue(TOGGLE_NAMES.avsEnabled);
  const featureTogglesLoading = useToggleLoadingValue();

  const loader = useLoaderData() as { avs: Promise<AvsData> };

  if (avsEnabled === false) {
    window.location.replace('/');
    return null;
  }

  const loadingIndicator = (
    <VaLoadingIndicator
      data-testid="avs-loading-indicator"
      message="Loading your after-visit summary"
    />
  );

  // Show loading indicator if feature toggles are still loading
  if (isLoggedIn && featureTogglesLoading) {
    return loadingIndicator;
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

              <VaAccordion>
                <VaAccordionItem header={generateAppointmentHeader(avs)} open>
                  <YourAppointment avs={avs} />
                </VaAccordionItem>
                <VaAccordionItem header="Your treatment plan from this appointment">
                  <YourTreatmentPlan avs={avs} />
                </VaAccordionItem>
                <VaAccordionItem header="Your health information as of this appointment">
                  <YourHealthInformation avs={avs} />
                </VaAccordionItem>
                <VaAccordionItem header="More information">
                  <MoreInformation avs={avs} />
                </VaAccordionItem>
              </VaAccordion>
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
export default connect<
  StateToProps,
  Record<string, never>,
  AvsProps,
  RootState
>(mapStateToProps)(Avs);
