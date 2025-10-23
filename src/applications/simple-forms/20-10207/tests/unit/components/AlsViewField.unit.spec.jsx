import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AlsViewField from '../../../components/AlsViewField';
import { ALS_DESCRIPTION } from '../../../config/constants';

describe('<AlsViewField />', () => {
  const mockFormData = {
    alsDocuments: [
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
      <AlsViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders ALS_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <AlsViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.contains(ALS_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders alsDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <AlsViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.alsDocuments.length,
    );
    done();
  });

  // Add more tests as needed...
});
