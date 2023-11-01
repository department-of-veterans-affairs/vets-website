import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CalculateYourBenefitsForm from '../../../components/profile/CalculateYourBenefitsForm';

describe('<CalculateYourBenefitsForm>', () => {
  it('should render', () => {
    const tree = shallow(
      <CalculateYourBenefitsForm
        eligibility={{}}
        inputs={{}}
        displayedInputs={{}}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  // it('should render', () => {
  //   const tree = shallow(
  //     <CalculateYourBenefitsForm
  //       eligibility={{}}
  //       inputs={{}}
  //       displayedInputs={{}}
  //     />,
  //   );
  //   console.log(tree.instance(), "tree")
  //   tree.find('AccordionItem').first().simulate('click');
  //   expect(tree.instance().toggleExpanded.calledWith('aboutYourSchool', true)).to.be.true;
  //   tree.unmount();
  // });
});
