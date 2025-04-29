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
      'The following program is approved for VA benefits at this institution. For more information about specific programs, search the institution catalog or website.',
    );
    programTypes.forEach((programType, i) => {
      const link = wrapper.find('[data-testid="program-link"]').at(i);
      expect(link.exists()).to.be.true;
      expect(link.prop('text')).to.equal(
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
      'The following programs are approved for VA benefits at this institution. For more information about specific programs, search the institution catalog or website.',
    );

    wrapper.unmount();
  });
});
