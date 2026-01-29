import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  routeToNextAppointmentPage,
  startDirectScheduleFlow,
  updateSelectedProvider,
} from '../../redux/actions';
import { getFormData } from '../../redux/selectors';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick({ history, dispatch, data, provider, pageKey }) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();
    dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
    dispatch(routeToNextAppointmentPage(history, pageKey, data));
    dispatch(updateSelectedProvider(provider));
  };
}

export default function ProviderCard({ provider }) {
  const { lastSeen, providerName, hasAvailability } = provider;
  const dispatch = useDispatch();
  const history = useHistory();
  const pageKey = useSelector(state => state?.newAppointment?.currentPageKey);
  const data = useSelector(getFormData);
  const { preferredDate } = useSelector(getNewAppointmentFlow);

  return (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        {providerName}
      </h2>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        Your last appointment was on {format(new Date(lastSeen), 'M/d/yyyy')}
      </p>

      {!hasAvailability && (
        <va-additional-info
          data-testid="no-appointments-available"
          trigger="Why you can't schedule online with this provider"
        >
          This provider has no appointments available for online scheduling.
        </va-additional-info>
      )}

      {hasAvailability && (
        <VaLink
          href={preferredDate.url}
          aria-label={`Choose your preferred date and time with ${providerName}`}
          active
          data-testid="choose-date-time"
          text="Choose your preferred date and time"
          onClick={handleClick({
            history,
            dispatch,
            data,
            provider,
            pageKey,
          })}
        />
      )}

      <hr
        aria-hidden="true"
        className="vads-u-margin-bottom--2 vads-u-margin-top--2 vads-u-border-color--gray-medium"
      />
    </div>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object,
};
