import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import MedalAwardViewField from '../../../components/MedalAwardViewField';
import { MEDAL_AWARD_DESCRIPTION } from '../../../config/constants';

describe('<MedalAwardViewField />', () => {
  const mockFormData = {
    medalAwardDocuments: [
      { name: 'Test Document', size: 12345 },
      { name: 'Another Test Document', size: 67890 },
    ],
  };
  let wrapper;

  afterEach(done => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    done();
  });

  it('renders without crashing', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <MedalAwardViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders MEDAL_AWARD_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <MedalAwardViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.contains(MEDAL_AWARD_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders medalAwardDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <MedalAwardViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.medalAwardDocuments.length,
    );
    done();
  });
});
