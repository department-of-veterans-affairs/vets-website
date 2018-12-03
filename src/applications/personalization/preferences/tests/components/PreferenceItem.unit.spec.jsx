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
    expect(component.debug()).to.equal(`<div>
  <div className="title-container va-nav-linkslist-heading">
    <h3>
      Health Care
    </h3>
    <button onClick={[Function]}>
      Remove
    </button>
  </div>
  <p className="va-introtext">
    With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.
  </p>
  <AdditionalInfo isHeading={true} additionalClass="benefit-faq" triggerText="What should I do before I apply for health care?">
    <healthFAQ />
  </AdditionalInfo>
  <Link className="usa-button" to="/health-care" onlyActiveOnIndex={false} style={{...}}>
    Apply Now for Health Care
  </Link>
</div>`);
    component
      .find('button')
      .last()
      .simulate('click');
    expect(handleViewToggle.args[0][0]).to.equal(benefitChoices[0].slug);
  });

  it('should render remove view', () => {
    props.isRemoving = true;
    const component = shallow(<PreferenceItem {...props} />);
    expect(component.debug()).to.equal(`<div>
  <h3 className="benefit-title">
    Health Care
  </h3>
  <AlertBox status="warning" headline="Confirm your change" isVisible={true}>
    <p>
      This will remove the 
      Health Care
       block from your dashboard. You can always add it back later by clicking the Find More VA Benefits button and selecting &quot;
      Health Care
      &quot;.
    </p>
    <button onClick={[Function]}>
      Remove
    </button>
    <button className="usa-button-secondary" onClick={[Function]}>
      Cancel
    </button>
  </AlertBox>
</div>`);

    component
      .find('button')
      .last()
      .simulate('click');
    expect(handleViewToggle.args[0][0]).to.equal(benefitChoices[0].slug);
    component
      .find('button')
      .first()
      .simulate('click');
    expect(handleRemove.args[0][0]).to.equal(benefitChoices[0].slug);
  });
});
