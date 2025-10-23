import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import TerminalIllnessViewField from '../../../components/TerminalIllnessViewField';
import { TERMINAL_ILLNESS_DESCRIPTION } from '../../../config/constants';

describe('<TerminalIllnessViewField />', () => {
  const mockFormData = {
    terminalIllnessDocuments: [
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
      <TerminalIllnessViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.exists()).to.equal(true);
    done();
  });

  it('renders TERMINAL_ILLNESS_DESCRIPTION', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <TerminalIllnessViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.contains(TERMINAL_ILLNESS_DESCRIPTION)).to.equal(true);
    done();
  });

  it('renders terminalIllnessDocuments when provided', done => {
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    wrapper = mount(
      <TerminalIllnessViewField
        defaultEditButton={() => {}}
        formData={mockFormData}
      />,
    );
    expect(wrapper.find('.va-growable-background')).to.have.lengthOf(
      mockFormData.terminalIllnessDocuments.length,
    );
    done();
  });
});
