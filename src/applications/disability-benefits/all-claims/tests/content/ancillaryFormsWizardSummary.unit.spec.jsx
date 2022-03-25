import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { SummaryDescription } from '../../content/ancillaryFormsWizardSummary';

describe('526 All Claims -- Ancillary forms wizard summary content', () => {
  it('should render only the appropriate panels', () => {
    const formData = {
      'view:modifyingHome': true,
      'view:modifyingCar': true,
      'view:aidAndAttendance': true,
      'view:unemployable': true,
      'view:unemployabilityUploadChoice': false,
    };
    const tree = shallow(<SummaryDescription formData={formData} />);

    const accordion = tree.find('va-accordion-item');
    expect(accordion.length).to.equal(4);
    expect(
      accordion
        .first()
        .find('h4')
        .text(),
    ).to.equal('Adapted housing assistance');
    expect(
      accordion
        .last()
        .find('h4')
        .text(),
    ).to.equal('Individual Unemployability');
    tree.unmount();
  });
});
