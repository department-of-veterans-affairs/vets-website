import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CompareCheckbox from '../../components/CompareCheckbox';

describe('CompareCheckbox', () => {
  it('renders the CompareCheckbox component', () => {
    const institution = 'Sample Institution';
    const compareChecked = false;
    const handleCompareUpdate = () => {};
    const cityState = 'Sample City, State';

    const wrapper = shallow(
      <CompareCheckbox
        institution={institution}
        compareChecked={compareChecked}
        handleCompareUpdate={handleCompareUpdate}
        cityState={cityState}
      />,
    );
    const input = () => wrapper.find('Checkbox').props();
    expect(input().label).to.equal('Compare');
    wrapper.unmount();
  });
});
