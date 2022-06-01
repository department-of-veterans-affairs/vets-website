import recordEvent from 'platform/monitoring/record-event';

const recordBadAddressEvent = ({ location = 'unknown' }) => {
  recordEvent({
    event: `bad_address_alert_shown_${location}`,
  });
};

export { recordBadAddressEvent };
