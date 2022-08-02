import recordEvent from 'platform/monitoring/record-event';

const recordBadAddressEvent = ({
  event = 'visible-alert-box',
  heading = 'unknown heading',
}) => {
  recordEvent({
    event,
    'alert-box-type': 'warning',
    'alert-box-heading': heading,
  });
};

export { recordBadAddressEvent };
