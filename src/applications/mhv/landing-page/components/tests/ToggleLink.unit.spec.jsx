import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import ToggleLink from '../ToggleLink';

const generateInitialState = ({
  mhvLinkOneEnabled = false,
  mhvLinkTwoEnabled = false,
}) => {
  return {
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_link_one_enabled: mhvLinkOneEnabled,
      // eslint-disable-next-line camelcase
      mhv_link_two_enabled: mhvLinkTwoEnabled,
    },
  };
};

describe('ToggleLink', () => {
  it('renders the new href, when available', async () => {
    const link = {
      href: '/foo',
      oldHref: '/bar',
      text: 'This is a link',
      toggle: '',
    };

    const middleware = [];
    const mockStore = configureStore(middleware);
    const initialState = generateInitialState({ mhvLinkOneEnabled: false });
    const store = mockStore(initialState);

    const screen = render(
      <Provider store={store}>
        <ToggleLink link={link} />
      </Provider>,
    );
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.href)).to.be.true;
  });

  it('renders the old href, when no new href is available', async () => {
    const link = {
      href: null,
      oldHref: '/bar',
      text: 'This is a link',
      toggle: '',
    };

    const middleware = [];
    const mockStore = configureStore(middleware);
    const initialState = generateInitialState({ mhvLinkOneEnabled: false });
    const store = mockStore(initialState);

    const screen = render(
      <Provider store={store}>
        <ToggleLink link={link} />
      </Provider>,
    );
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.oldHref)).to.be.true;
  });

  // TODO: Test feature toggle affecting which link is displayed
  it('renders the old href if the feature toggle is off', async () => {
    const link = {
      href: '/new',
      oldHref: '/bar',
      text: 'This is a link',
      toggle: 'mhv_link_one_enabled',
    };

    const middleware = [];
    const mockStore = configureStore(middleware);
    const initialState = generateInitialState({
      mhvLinkOneEnabled: false,
      mhvLinkTwoEnabled: true,
    });
    const store = mockStore(initialState);

    const screen = render(
      <Provider store={store}>
        <ToggleLink link={link} />
      </Provider>,
    );
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.oldHref)).to.be.true;
  });

  it('renders the new href if the feature toggle is on', async () => {
    const link = {
      href: '/new',
      oldHref: '/bar',
      text: 'This is a link',
      toggle: 'mhv_link_one_enabled',
    };

    const middleware = [];
    const mockStore = configureStore(middleware);
    const initialState = generateInitialState({ mhvLinkOneEnabled: true });
    const store = mockStore(initialState);

    const screen = render(
      <Provider store={store}>
        <ToggleLink link={link} />
      </Provider>,
    );
    const anchorLink = await screen.findByText('This is a link');
    expect(anchorLink).to.exist;
    expect(anchorLink.href.endsWith(link.href)).to.be.true;
  });
});
