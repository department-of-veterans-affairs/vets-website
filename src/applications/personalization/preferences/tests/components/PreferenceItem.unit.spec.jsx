import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import PreferenceItem from '../../components/PreferenceItem';
import { benefitChoices } from '../../helpers';

const handleViewToggle = spy();
const handleRemove = spy();

const props = {
  handleViewToggle,
  handleRemove,
  benefit: benefitChoices[0],
};

describe('<PreferenceItem>', () => {
  it('should render', () => {
    props.isRemoving = false;
    const component = shallow(<PreferenceItem {...props} />);
    // Display benefit-specific Heading
    expect(component.find('.title-container').html()).to.contain('Health Care');
    // Display benefit-specific introduction
    expect(
      component
        .find('.va-introtext')
        .first()
        .html(),
    ).to.contain(
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    );
    // Display benefit-specific FAQs
    expect(component.find('AdditionalInfo').length).to.equal(1);
    // Display benefit-specific CTA
    expect(
      component
        .find('Link.usa-button')
        .first()
        .html(),
    ).to.contain('Apply Now for Health Care');
    component
      .find('button')
      .first()
      .simulate('click');
    expect(handleViewToggle.args[0][0]).to.equal(benefitChoices[0].slug);
    component.unmount();
  });

  it('should render remove view', () => {
    props.isRemoving = true;
    const component = shallow(<PreferenceItem {...props} />);
    expect(component.find('AlertBox').html()).to.contain(
      `We’ll remove this content. If you’d like to see the information again, you can always add it back. Just click on the “Find More Benefits” button at the top of your dashboard, then select “Health Care.”`,
    );

    component
      .find('button')
      .first()
      .simulate('click');
    expect(handleRemove.args[0][0]).to.equal(benefitChoices[0].slug);
    component.unmount();
  });
});
