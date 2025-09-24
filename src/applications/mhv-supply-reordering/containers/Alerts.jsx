import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertDeceased,
  AlertNoRecordForUser,
  AlertNoSuppliesForReorder,
  AlertReorderAccessExpired,
  AlertServerError,
} from '../components/alerts';

import {
  canReorderOn,
  showAlertDeceased,
  showAlertNoRecordForUser,
  showAlertNoSuppliesForReorder,
  showAlertReorderAccessExpired,
  showAlertServerError,
} from '../selectors';

const Alerts = () => {
  const reorderDate = useSelector(canReorderOn);
  const renderAlertDeceased = useSelector(showAlertDeceased);
  const renderAlertNoRecordForUser = useSelector(showAlertNoRecordForUser);
  const renderAlertNoSuppliesForReorder = useSelector(showAlertNoSuppliesForReorder); // prettier-ignore
  const renderAlertReorderAccessExpired = useSelector(showAlertReorderAccessExpired); // prettier-ignore
  const renderAlertServerError = useSelector(showAlertServerError);

  if (renderAlertDeceased) {
    return <AlertDeceased />;
  }

  if (renderAlertNoRecordForUser) {
    return <AlertNoRecordForUser />;
  }

  if (renderAlertReorderAccessExpired) {
    return <AlertReorderAccessExpired />;
  }

  if (renderAlertServerError) {
    return <AlertServerError />;
  }

  if (renderAlertNoSuppliesForReorder) {
    return <AlertNoSuppliesForReorder reorderDate={reorderDate} />;
  }

  return null;
};

export default Alerts;
