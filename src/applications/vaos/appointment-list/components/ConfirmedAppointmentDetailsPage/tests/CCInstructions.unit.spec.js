import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import CCInstructions from '../CCInstructions';

describe('VAOS Component: CCInstructions', () => {
  const initialState = {};

  it('should render comment in CCInstructions', async () => {
    const appointment = {
      comment: 'Follow-up/Routine: I have a headache',
    };

    const wrapper = renderWithStoreAndRouter(
      <CCInstructions appointment={appointment} />,
      {
        initialState,
      },
    );
    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'Special instructions',
      }),
    ).to.exist;

    // CCInstructions with comment
    expect(await wrapper.findByText('Follow-up/Routine: I have a headache')).to
      .exist;
  });

  it('should not render comment in CCInstructions', async () => {
    const appointment = {
      comment: '',
    };

    const wrapper = renderWithStoreAndRouter(
      <CCInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // CCInstructions with no comment
    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'Special instructions',
      }),
    ).to.be.null;
  });
});
