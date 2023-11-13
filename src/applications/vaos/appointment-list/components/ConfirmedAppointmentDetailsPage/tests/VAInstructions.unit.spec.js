import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import VAInstructions from '../VAInstructions';

describe('VAInstructions component', () => {
  const initialState = {};

  it('should render comment in VAInstructions', async () => {
    const appointment = {
      comment: 'Routine/Follow-up',
    };

    const wrapper = renderWithStoreAndRouter(
      <VAInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // CCInstructions with comment
    expect(await wrapper.findByText('Routine/Follow-up')).to.exist;
  });
});
