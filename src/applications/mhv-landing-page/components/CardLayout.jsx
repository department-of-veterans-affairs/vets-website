import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import {
  isAuthenticatedWithSSOe,
  mrPhase1Enabled,
  mhvAccountStatusUserError,
  mhvAccountStatusUsersuccess,
} from '../selectors';

import NavCard from './NavCard';
import MedicalRecordsCard from './MedicalRecordsCard';
import ErrorNavCard from './ErrorNavCard';
import { HEALTH_TOOL_HEADINGS, MHV_ACCOUNT_CARDS } from '../constants';

const layoutData = data => {
  const offset = 2;
  const rows = [];
  for (let i = 0; i < data.length; i += offset) {
    rows.push(data.slice(i, i + offset));
  }
  return rows;
};

const CardLayout = ({ data }) => {
  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountSuccess = useSelector(mhvAccountStatusUsersuccess);
  const isMrPhase1Enabled = useSelector(mrPhase1Enabled);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const blueButtonUrl = mhvUrl(ssoe, 'download-my-data');

  const rowCols = layoutData(data);
  return rowCols.map((row, x) => {
    return (
      <div
        className={classnames(
          'vads-l-row',
          'vads-u-justify-content--space-between',
          'vads-u-margin-bottom--0',
          'medium-screen:vads-u-margin-bottom--2',
        )}
        key={`row-${x}`}
      >
        {row.map((col, y) => (
          <div
            className={classnames(
              'vads-l-col--12',
              'medium-screen:vads-l-col',
              'mhv-u-grid-gap',
              'vads-u-margin-bottom--2',
              'medium-screen:vads-u-margin-bottom--0',
            )}
            data-testid={`mhv-link-group-card-${x * rowCols.length + y}`}
            key={`col-${y}`}
          >
            {mhvAccountStatusUserErrors.length > 0 &&
              MHV_ACCOUNT_CARDS.includes(col.title) && (
                <ErrorNavCard
                  title={col.title}
                  code={mhvAccountStatusUserErrors[0].code}
                />
              )}
            {(!MHV_ACCOUNT_CARDS.includes(col.title) || mhvAccountSuccess) &&
              (col.title === HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS &&
              !isMrPhase1Enabled ? (
                <MedicalRecordsCard href={blueButtonUrl} />
              ) : (
                <NavCard {...col} />
              ))}
          </div>
        ))}
      </div>
    );
  });
};

export default CardLayout;
