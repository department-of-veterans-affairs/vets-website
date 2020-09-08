// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import times from 'lodash/times';
// Relative imports.
import { SearchResults } from './index';

describe('Container <SearchResults>', () => {
  it('renders a loading indicator', () => {
    const tree = shallow(<SearchResults fetching />);

    const loadingIndicator = tree.find('LoadingIndicator');
    expect(loadingIndicator).to.have.lengthOf(1);

    tree.unmount();
  });

  it('renders an error alert box', () => {
    const tree = shallow(<SearchResults error="test" />);

    expect(tree.html()).to.include('test');
    expect(tree.html()).to.include('Something went wrong');

    tree.unmount();
  });

  it('renders nothing', () => {
    const tree = shallow(<SearchResults />);

    expect(tree.isEmptyRender()).to.be.true;

    tree.unmount();
  });

  it('renders no results', () => {
    const tree = shallow(<SearchResults results={[]} />);

    expect(tree.html()).to.include('No results');

    tree.unmount();
  });

  it('renders a table and pagination', () => {
    const results = times(10, index => ({
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
      id: `${index + 1}`,
      type: 'third-party-app',
    }));

    const tree = shallow(<SearchResults results={results} />);

    expect(tree.find('.search-results')).to.have.lengthOf(1);
    expect(tree.find('Pagination')).to.have.lengthOf(1);

    tree.unmount();
  });
});
