import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PowViewField from '../../../components/PowViewField';
import { POW_DESCRIPTION } from '../../../config/constants';

describe('<PowViewField />', () => {
  const mockFormData = {
    powDocuments: [
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
      <PowViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders POW_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <PowViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.contains(POW_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders powDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <PowViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.powDocuments.length,
    );
    done();
  });
});
