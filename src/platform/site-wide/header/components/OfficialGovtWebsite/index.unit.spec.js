// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { OfficialGovtWebsite } from '.';

describe('Header <OfficialGovtWebsite>', () => {
  it('renders content', () => {
    const wrapper = shallow(<OfficialGovtWebsite />);
    expect(wrapper.text()).includes(
      'An official website of the United States government.',
    );
    wrapper.unmount();
  });
});
