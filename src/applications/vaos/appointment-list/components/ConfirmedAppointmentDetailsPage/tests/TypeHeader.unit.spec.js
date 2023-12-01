import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import TypeHeader from '../TypeHeader';
import { formatHeader } from '../DetailsVA.util';

describe('TypeHeader component', () => {
  it('should render ', async () => {
    const appointment = {
      vaos: {
        isCOVIDVaccine: true,
      },
    };
    const header = formatHeader(appointment);
    const wrapper = renderWithStoreAndRouter(
      <TypeHeader>{header}</TypeHeader>,
      {},
    );

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.null;
  });
});
