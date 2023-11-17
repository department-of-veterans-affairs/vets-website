import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import VAInstructions from '../VAInstructions';

describe('VAInstructions component', () => {
  const initialState = {};

  it('should render comment in VAInstructions for PURPOSE_TEXT_V2 short', async () => {
    const appointment = {
      comment: 'Routine/Follow-up', // This is PURPOSE_TEXT_V2 short
    };

    const wrapper = renderWithStoreAndRouter(
      <VAInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // VAInstructions with comment
    expect(await wrapper.findByText('Routine/Follow-up')).to.exist;

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.not.be.null;
  });

  it('should render comment in VAInstructions other', async () => {
    const appointment = {
      comment: 'Routine/Follow-up, additional text', // This is PURPOSE_TEXT_V2 short but includes additional text
    };

    const wrapper = renderWithStoreAndRouter(
      <VAInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    // VAInstructions with comment
    expect(await wrapper.findByText('Routine/Follow-up, additional text')).to
      .exist;

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.not.be.null;
  });

  it('should render not render comment in VAInstructions', async () => {
    const appointment = {
      comment: 'Sickness, additional',
    };

    const wrapper = renderWithStoreAndRouter(
      <VAInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.null;
  });

  it('empty comment in VAInstructions', async () => {
    const appointment = {
      comment: '',
    };

    const wrapper = renderWithStoreAndRouter(
      <VAInstructions appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.null;
  });
});
