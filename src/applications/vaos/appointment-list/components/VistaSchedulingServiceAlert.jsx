import React from 'react';
import { useSelector } from 'react-redux';
import InfoAlert from '../../components/InfoAlert';
import { selectFeatureVaosV2Next } from '../../redux/selectors';
import { selectBackendServiceFailuresInfo } from '../redux/selectors';
import { FETCH_STATUS } from '../../utils/constants';

export default function VistaSchedulingServiceAlert() {
  const featureVaosV2Next = useSelector(state =>
    selectFeatureVaosV2Next(state),
  );
  const { backendServiceFailures, futureStatus } = useSelector(state =>
    selectBackendServiceFailuresInfo(state),
  );

  if (futureStatus === FETCH_STATUS.succeeded) {
    const hasVistaServiceFailure = !!backendServiceFailures?.meta.find(
      backendServiceFailure =>
        backendServiceFailure?.system === 'VSP' &&
        backendServiceFailure?.code === 10000,
    );
    if (featureVaosV2Next && hasVistaServiceFailure) {
      return (
        <>
          <InfoAlert
            className="vads-u-margin-bottom--4"
            status="warning"
            level="3"
            headline="We can't display in-person VA appointments"
          >
            <p>
              We're working to resolve this issue. To manage those appointments,
              contact the facility where they are scheduled
            </p>
            <p>
              <a href="/find-locations">Facility locator</a>
            </p>
          </InfoAlert>
        </>
      );
    }
  }
  return null;
}
