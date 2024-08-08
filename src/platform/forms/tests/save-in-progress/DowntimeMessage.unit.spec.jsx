import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import moment from 'moment';

import DowntimeMessage from '../../save-in-progress/DowntimeMessage';

describe('<DowntimeMessage>', () => {
  it('should render with generic message', () => {
    const { container } = render(<DowntimeMessage downtime={{}} />);
    expect(container.querySelector('va-alert h3')).to.contain.text(
      'This application is down for maintenance',
    );
    expect(container.querySelector('va-alert p')).to.contain.text(
      'We’re sorry it’s not working right now.',
    );
  });

  it('should render with window message', () => {
    const endTime = moment().add(2, 'days');
    const { container } = render(<DowntimeMessage downtime={{ endTime }} />);

    expect(container.querySelector('va-alert p')).to.contain.text(
      `We’re sorry it’s not working right now, and we hope to be finished by ${endTime.format(
        'MMMM Do, LT',
      )}`,
    );
  });
});
