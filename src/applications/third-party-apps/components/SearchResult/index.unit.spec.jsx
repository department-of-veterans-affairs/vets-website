// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchResult } from './index';

describe('<SearchResult>', () => {
  it('should render', () => {
    const props = {
      item: {
        name: 'Apple Health',
        iconURL:
          'https://www.apple.com/v/ios/health/c/images/overview/icon_health__c9yeoina5qaa_large_2x.png',
        categories: ['Health'],
        platforms: ['iOS'],
        appURL: 'https://www.apple.com/ios/health/',
        description:
          'With the Apple Health app, you can see all your health records — such as medications, immunizations, lab results, and more — in one place. The Health app continually updates these records giving you access to a single, integrated snapshot of your health profile whenever you want, quickly and privately. All Health Records data is encrypted and protected with the user’s iPhone passcode, Touch ID or Face ID.',
        permissions: [
          '[Placeholder copy - scopes from OAuth listed here]',
          '[Placeholder copy - scopes from OAuth listed here]',
          '[Placeholder copy - scopes from OAuth listed here]',
          '[Placeholder copy - scopes from OAuth listed here]',
          '[Placeholder copy - scopes from OAuth listed here]',
        ],
        privacyPolicyURL: 'https://support.apple.com/en-us/HT209519',
        termsOfServiceURL: 'https://www.apple.com/legal/sla/',
        id: '1',
        type: 'third-party-app',
      },
    };

    const wrapper = shallow(<SearchResult {...props} />);
    const firstText = wrapper.text();

    expect(firstText).to.include(props.item.name);
    expect(firstText).to.not.include(props.item.description);

    wrapper.setState({ show: true });
    const secondText = wrapper.text();

    expect(secondText).to.include(props.item.name);
    expect(secondText).to.include(props.item.description);

    wrapper.unmount();
  });
});
