import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import VsiViewField from '../../../components/VsiViewField';
import { VSI_DESCRIPTION } from '../../../config/constants';

describe('<VsiViewField />', () => {
  const mockFormData = {
    vsiDocuments: [
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
      <VsiViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders VSI_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <VsiViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.contains(VSI_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders vsiDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <VsiViewField defaultEditButton={() => {}} formData={mockFormData} />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.vsiDocuments.length,
    );
    done();
  });
});
