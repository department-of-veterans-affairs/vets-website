import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SignatureBoxes from '../../../components/PreSubmitInfo/index';
import maximalFormData from '../../e2e/fixtures/data/twoSecondaryCaregivers.json';

describe('<SignatureBoxes>', () => {
  it('renders correctly', () => {
    const props = {
      onSectionComplete: () => false,
      formData: {
        ...maximalFormData,
      },
      showError: false,
    };

    const wrapper = shallow(<SignatureBoxes.CustomComponent {...props} />);
    const text = wrapper.text();

    expect(text).to.include(
      "Please review information entered into this application. The Veteran and each family caregiver applicant must sign the appropriate section.<Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) />Note: According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)' to include 'Please review information entered into this application. The Veteran and each family caregiver applicant must sign the appropriate section.<Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) />Note: According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)' to include 'Please review information entered into this application. The Veteran and each family caregiver applicant must sign the appropriate section.<Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) />Note: According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)' to include 'Please review information entered into this application. The Veteran and each family caregiver applicant must sign the appropriate section.<Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) />Note: According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)' to include 'Please review information entered into this application. The Veteran and each family caregiver applicant must sign the appropriate section.<Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) /><Connect(SignatureCheckbox) />Note: According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or providing incorrect information. (See 18 U.S.C. 1001)' to include 'This app can’t access any new information from your VA.gov profile",
    );

    wrapper.unmount();
  });
});
