import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import Alert from './Alerts';
import alertMessage from '../utils/alert-messages';
import OtherVADebts from './OtherVADebts';
import { ALERT_TYPES, APP_TYPES, API_RESPONSES } from '../utils/helpers';

const renderAlert = (alertType, hasDebts) => {
  const adjustedAlertType =
    alertType === ALERT_TYPES.ERROR && hasDebts === API_RESPONSES.ERROR
      ? ALERT_TYPES.ALL_ERROR
      : alertType;
  const alertInfo = alertMessage(adjustedAlertType, APP_TYPES.COPAY);
  const showOther = hasDebts > 0;
  return (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {showOther && <OtherVADebts module={APP_TYPES.DEBT} subHeading />}
      {adjustedAlertType === ALERT_TYPES.ALL_ERROR && (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      )}
    </va-alert>
  );
};

const AlertView = ({ pathname, alertType, error, cdpToggle, hasDebts }) => {
  const overviewPage = 'Current copay balances';
  const detailsPage = 'Copay bill details';
  const title = pathname === '/' ? overviewPage : detailsPage;

  return (
    <>
      <VaBreadcrumbs label="Breadcrumb">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">{title}</a>
      </VaBreadcrumbs>
      <h1 data-testid="overview-page-title">{title}</h1>
      {cdpToggle ? (
        renderAlert(alertType, hasDebts)
      ) : (
        <Alert type={alertType} error={error} />
      )}
    </>
  );
};

AlertView.propTypes = {
  alertType: PropTypes.string,
  cdpToggle: PropTypes.bool,
  error: PropTypes.object,
  hasDebts: PropTypes.number,
  pathname: PropTypes.string,
};

export default AlertView;
