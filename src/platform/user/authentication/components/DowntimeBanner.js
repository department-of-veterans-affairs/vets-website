import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import { DOWNTIME_BANNER_CONFIG, AUTH_DEPENDENCIES } from '../constants';

export function DowntimeBanners({ statuses }) {
  const [statusState, setStatusDown] = useState({});

  useEffect(
    () => {
      if (statuses && statuses.length) {
        const banner = statuses
          .sort((a, b) => {
            if (a.service < b.service) return 1;
            if (a.service > b.service) return -1;
            return 0;
          })
          .find(k => !['active'].includes(k.status));

        setStatusDown(DOWNTIME_BANNER_CONFIG[(banner?.serviceId)] ?? {});
      }
    },
    [statuses, setStatusDown],
  );

  const { status: errorStatus, headline, message } = statusState;

  return (
    <ExternalServicesError dependencies={AUTH_DEPENDENCIES}>
      <div className="downtime-notification row">
        <div className="columns small-12">
          <div className="form-warning-banner fed-warning--v2">
            <va-alert visible status={errorStatus}>
              <h2 slot="headline">{headline}</h2>
              {message}
            </va-alert>
          </div>
        </div>
      </div>
    </ExternalServicesError>
  );
}

export const mapStateToProps = state => state.externalServiceStatuses;
export default connect(mapStateToProps)(DowntimeBanners);
