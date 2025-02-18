import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Programs from '../../../components/profile/Programs';
import { mapProgramTypeToName } from '../../../utils/helpers';

describe('<Programs>', () => {
  it('should render', () => {
    const programTypes = ['OJT'];
    const facilityCode = '12345';
    const wrapper = shallow(
      <Programs programTypes={programTypes} facilityCode={facilityCode} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal(
      'The following program is approved by the VA at this institution.',
    );
    programTypes.forEach(programType => {
      const link = wrapper.find('[data-testid="program-link"]');
      expect(link.exists()).to.be.true;
      expect(link.text()).to.equal(
        `See ${mapProgramTypeToName(programType)} programs`,
      );
    });

    wrapper.unmount();
  });
  it('should render the correct sentence for multiple program types', () => {
    const programTypes = ['Undergraduate', 'Graduate'];
    const facilityCode = '12345';
    const wrapper = shallow(
      <Programs programTypes={programTypes} facilityCode={facilityCode} />,
    );
    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal(
      'The following programs are approved by the VA at this institution.',
    );

    wrapper.unmount();
  });
});
