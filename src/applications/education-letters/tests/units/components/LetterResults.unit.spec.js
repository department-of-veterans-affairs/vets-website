import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { HasLetters, NoLetters } from '../../../components/LetterResults';
import {
  MEBClaimStatus,
  TOEClaimStatus,
} from '../../fixtures/claimStatus.json';

describe('Render letter results UI', () => {
  const mockStore = configureMockStore();

  it('HasLetter MEB UI', async () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <HasLetters claimStatus={MEBClaimStatus} />
      </Provider>,
    );

    expect(wrapper.text()).to.not.include(
      'Your letter is not available to you through this tool',
    );
    expect(wrapper.text()).to.include('Letter available for you to download');
    wrapper.unmount();
  });

  it('HasLetter TOE UI', async () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <HasLetters claimStatus={TOEClaimStatus} />
      </Provider>,
    );

    expect(wrapper.text()).to.not.include(
      'Your letter is not available to you through this tool',
    );
    expect(wrapper.text()).to.include('Letter available for you to download');
    wrapper.unmount();
  });

  it('NoLetters UI', async () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <NoLetters />
      </Provider>,
    );

    expect(wrapper.text()).to.include(
      'Your letter is not available to you through this tool',
    );
    expect(wrapper.text()).to.not.include(
      'Letter available for you to download',
    );
    wrapper.unmount();
  });
});
