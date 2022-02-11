import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import PropTypes from 'prop-types';
import Alert from './Alerts';

const AlertView = ({ pathname, alertType, error }) => {
  const overviewPage = 'Current copay balances';
  const detailsPage = 'Copay bill details';
  const title = pathname === '/' ? overviewPage : detailsPage;

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">{title}</a>
      </Breadcrumbs>
      <h1>{title}</h1>
      <Alert type={alertType} error={error} />
    </>
  );
};

AlertView.propTypes = {
  alertType: PropTypes.string,
  error: PropTypes.object,
  pathname: PropTypes.string,
};

export default AlertView;
