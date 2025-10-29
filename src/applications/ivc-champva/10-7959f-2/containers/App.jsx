import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { isProfileLoading } from 'platform/user/selectors';
import { Toggler } from 'platform/utilities/feature-toggles';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import WIP from '../../shared/components/WIP';
import formConfig from '../config/form';

const App = ({ location, children }) => {
  const isAppLoading = useSelector(
    state =>
      state?.featureToggles?.loading === true ||
      isProfileLoading(state) === true,
    shallowEqual,
  );

  const wipContent = useMemo(
    () => ({
      description:
        'We’re rolling out the Foreign Medical Program (FMP) claims (VA Form 10-7959f-2) in stages. It’s not quite ready yet. Please check back again soon.',
      redirectText: 'Return to VA.gov home page',
      redirectLink: '/',
    }),
    [],
  );

  const appRouter = useMemo(
    () => (
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <DowntimeNotification
          appTitle="File a Foreign Medical Program (FMP) claim"
          dependencies={formConfig.downtime.dependencies}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    ),
    [children, location],
  );

  const comingSoonAlert = useMemo(() => <WIP content={wipContent} />, [
    wipContent,
  ]);

  if (isAppLoading) {
    return (
      <va-loading-indicator
        message="Loading application..."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.form107959f2}>
      <Toggler.Enabled>{appRouter}</Toggler.Enabled>
      <Toggler.Disabled>{comingSoonAlert}</Toggler.Disabled>
    </Toggler>
  );
};

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    href: PropTypes.string,
  }),
};

export default App;
