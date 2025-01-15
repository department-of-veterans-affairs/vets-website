import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertDeceased,
  AlertNoRecordForUser,
  AlertNoSuppliesForReorder,
  AlertReorderAccessExpired,
  AlertSomethingWentWrong,
} from '../components/alerts';

import {
  canReorderOn,
  showAlertDeceased,
  showAlertNoRecordForUser,
  showAlertNoSuppliesForReorder,
  showAlertReorderAccessExpired,
  showAlertSomethingWentWrong,
} from '../selectors';

const Alerts = () => {
  const reorderDate = useSelector(canReorderOn);
  const renderAlertDeceased = useSelector(showAlertDeceased);
  const renderAlertNoRecordForUser = useSelector(showAlertNoRecordForUser);
  const renderAlertNoSuppliesForReorder = useSelector(showAlertNoSuppliesForReorder); // prettier-ignore
  const renderAlertReorderAccessExpired = useSelector(showAlertReorderAccessExpired); // prettier-ignore
  const renderAlertSomethingWentWrong = useSelector(showAlertSomethingWentWrong); // prettier-ignore

  if (renderAlertDeceased) {
    return <AlertDeceased />;
  }

  if (renderAlertNoRecordForUser) {
    return <AlertNoRecordForUser />;
  }

  if (renderAlertReorderAccessExpired) {
    return <AlertReorderAccessExpired />;
  }

  if (renderAlertSomethingWentWrong) {
    return <AlertSomethingWentWrong />;
  }

  if (renderAlertNoSuppliesForReorder) {
    return <AlertNoSuppliesForReorder reorderDate={reorderDate} />;
  }

  return null;
};

export default Alerts;
