import recordEvent from 'platform/monitoring/record-event';

const recordBadAddressEvent = ({ location = 'unknown' }) => {
  recordEvent({
    event: `profile-bad-address-${location}-alert-shown`,
  });
};

export { recordBadAddressEvent };
