import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Programs from '../../../components/profile/Programs';

describe('<Programs>', () => {
  it('should render', () => {
    const programTypes = ['Undergraduate', 'Graduate', 'OJT'];
    const facilityCode = '12345';
    const name = 'Example Institution';
    const wrapper = shallow(
      <Programs
        programTypes={programTypes}
        facilityCode={facilityCode}
        institutionName={name}
      />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal(
      'The following programs are approved by the VA at this institution.',
    );

    programTypes.forEach(programType => {
      expect(
        wrapper.contains(
          <p className="vads-u-font-weight--bold vads-u-padding-right--2">
            {programType}
          </p>,
        ),
      ).to.equal(true);
    });

    wrapper.unmount();
  });
});
