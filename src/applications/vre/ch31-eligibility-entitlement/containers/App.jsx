import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import { selectUser } from 'platform/user/selectors';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import Breadcrumbs from '../components/Breadcrumbs';

const App = () => {
  const user = useSelector(selectUser);

  return (
    <RequiredLoginView user={user}>
      <div className="row">
        <Breadcrumbs />
        <DowntimeNotification
          appTitle="Veteran Readiness and Employment - Eligibility and Entitlement"
          dependencies={[externalServices.vreCh31Eligibility]}
        >
          <Outlet />
        </DowntimeNotification>
      </div>
    </RequiredLoginView>
  );
};

export default App;
