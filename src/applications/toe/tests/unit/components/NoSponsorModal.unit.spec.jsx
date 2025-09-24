import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NoSponsorModal from '../../../components/NoSponsorModal';

describe('NoSponsorModal Component', () => {
  it('shows VaModal when sponsorsList is empty', () => {
    const wrapper = mount(<NoSponsorModal sponsorsList={[]} />);
    const modal = wrapper.find(VaModal);
    expect(modal).to.have.lengthOf(1);
    expect(modal.prop('visible')).to.be.true;
    wrapper.unmount();
  });

  it('hides VaModal when sponsorsList has items', () => {
    const sponsors = [{ id: '1', name: 'Jane Doe', relationship: 'Child' }];
    const wrapper = mount(<NoSponsorModal sponsorsList={sponsors} />);
    const modal = wrapper.find(VaModal);
    expect(modal).to.have.lengthOf(1);
    expect(modal.prop('visible')).to.be.false;
    wrapper.unmount();
  });
});
