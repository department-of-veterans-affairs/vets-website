import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import Disclaimer from '../components/page/Disclaimer';

describe('Disclaimer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = render(<Disclaimer />);
  });

  it('displays description', async () => {
    await waitFor(
      () =>
        expect(
          wrapper.getByText(/Use our chatbot to find information on VA.gov./),
        ).to.exist,
    );

    expect(wrapper.getByText(/Welcome to our chatbot/)).to.exist;

    expect(
      wrapper.getByText(
        /We're still building the bot's ability to respond to your questions, so it won't have answers to every question./,
      ),
    ).to.exist;

    expect(
      wrapper.getByText(
        /If you have questions about VA benefits and services that our chatbot can’t answer right now/,
      ),
    ).to.exist;
  });

  it(`does not reference the term 'virtual agent'`, async () => {
    await waitFor(
      () => expect(wrapper.queryAllByText(/virtual agent/)).to.be.empty,
    );
  });
});
