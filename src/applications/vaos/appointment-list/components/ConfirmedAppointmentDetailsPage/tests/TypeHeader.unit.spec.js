import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import TypeHeader from '../TypeHeader';
import { formatHeader } from '../DetailsVA.util';
import { screen } from '@testing-library/dom';

describe('TypeHeader component', () => {
  it('should render ', async () => {
    const appointment = {
      vaos: {
        isVideo: true,
        isPastAppointment: true,
      },
      comment: 'Routine/Follow-up',
    };
    const header = formatHeader(appointment);
    const wrapper = renderWithStoreAndRouter(
      <TypeHeader>{header}</TypeHeader>,
      {},
    );

    // screen.debug();

    expect(await wrapper.queryByText('VA appointment')).to.exist;
    expect(
      wrapper.getByText('VA appointment', {
        exact: true,
        selector: 'h2',
      }),
    ).to.have.attribute('data-cy', 'va-appointment-details-header');
  });
});
