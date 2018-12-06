import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SummaryDescription from '../../content/ancillaryFormsWizardSummary';

describe('526 All Claims -- Ancillary forms wizard summary content', () => {
  it('should render only the appropriate panels', () => {
    const formData = {
      'view:modifyingHome': true,
      // view:modifyingCar omitted
      'view:aidAndAttendance': true,
      'view:unemployable': false,
    };
    const tree = shallow(<SummaryDescription formData={formData} />);

    const collapsiblePanels = tree.find('CollapsiblePanel');
    expect(collapsiblePanels.length).to.equal(2);
    expect(collapsiblePanels.first().props().panelName).to.equal(
      'Adapted housing assistance',
    );
    expect(collapsiblePanels.last().props().panelName).to.equal(
      'Aid and Attendance',
    );
  });
});
