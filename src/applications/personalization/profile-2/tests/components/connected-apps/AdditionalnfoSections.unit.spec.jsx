import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { AdditionalInfoSections } from '../../../components/connected-apps/AdditionalInfoSections';

describe('<AdditionalInfoSections>', () => {
  const activeApps = [
    {
      attributes: {
        title: 'Test App',
        logo: 'https://ok6static.oktacdn.com/fs/bco/4/fs06uplrfh5ML4ubr2p7',
        grants: [],
      },
      id: '0oa3s6dlvxgsZr62p2p7',
      type: 'okta_redis_apps',
    },
    {
      attributes: {
        title: 'Test App 2',
        logo: 'https://ok6static.oktacdn.com/fs/bco/4/fs06uplrfh5ML4ubr2p7',
        grants: [],
      },
      id: '1oa3s6dlvxgsZr62p2p7',
      type: 'okta_redis_apps',
    },
  ];
  it('renders correctly when activeApps is not empty', () => {
    const wrapper = mount(<AdditionalInfoSections activeApps={activeApps} />);

    const text = wrapper.text();

    expect(text).to.include(
      'What other third-party apps can I connect to my profile?',
    );
    expect(text).to.include(
      'How do I connect a third-party app to my profile?',
    );
    expect(text).to.include(
      'What should I do if my records are wrong or out of date in a connected app?',
    );
    expect(text).to.include(
      'What should I do if I no longer trust a connected app?',
    );

    wrapper.unmount();
  });

  it('renders correctly when activeApps is empty', () => {
    const wrapper = mount(<AdditionalInfoSections />);

    const text = wrapper.text();

    expect(text).not.to.include(
      'What other third-party apps can I connect to my profile?',
    );
    expect(text).to.include(
      'How do I connect a third-party app to my profile?',
    );
    expect(text).not.to.include(
      'What should I do if my records are wrong or out of date in a connected app?',
    );
    expect(text).not.to.include(
      'What should I do if I no longer trust a connected app?',
    );

    wrapper.unmount();
  });
});
