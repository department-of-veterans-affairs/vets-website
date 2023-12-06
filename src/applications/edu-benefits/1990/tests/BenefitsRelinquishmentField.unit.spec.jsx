import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BenefitsRelinquishmentField from '../BenefitsRelinquishmentField';

describe('<BenefitsRelinquishmentField />', () => {
  it('renders ObjectField when in reviewMode and benefitsRelinquished is defined and not "unknown"', () => {
    const props = {
      schema: {},
      uiSchema: {},
      formData: {
        benefitsRelinquished: 'someValue',
      },
      registry: {
        fields: {
          ObjectField: () => <div>ObjectField</div>,
        },
      },
      formContext: {
        reviewMode: true,
      },
    };

    const wrapper = shallow(<BenefitsRelinquishmentField {...props} />);
    expect(wrapper.find('ObjectField')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
