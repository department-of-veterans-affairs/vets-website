import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MGIBEnrollmentStatement from '../../components/MGIBEnrollmentStatement';

describe('<MGIBEnrollmentStatement />', () => {
  it('renders the component with correct structure', () => {
    const { container, getByText } = render(<MGIBEnrollmentStatement />);

    // Using container to access elements by ID
    const divElement = container.querySelector(
      '#montgomery-gi-bill-enrollment-statement',
    );
    expect(divElement).to.exist;

    // Using React Testing Library to check elements
    expect(getByText('Montgomery GI Bill enrollment verification')).to.exist;
    expect(
      getByText(
        /If you’re currently using Montgomery GI Bill benefits, you’ll need to verify your enrollment after each month to receive payments./,
      ),
    ).to.exist;

    // Using Enzyme for additional checks
    const wrapper = shallow(<MGIBEnrollmentStatement />);
    expect(wrapper.find('h1').text()).to.equal(
      'Montgomery GI Bill enrollment verification',
    );
    expect(wrapper.find('.va-introtext').text()).to.include(
      'If you’re currently using Montgomery GI Bill benefits, you’ll need to verify your enrollment after each month to receive payments.',
    );

    wrapper.unmount();
  });
});
