import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
// import { shallow } from 'enzyme';
import EnrollmentVerificationPageWrapper from '../../components/EnrollmentVerificationPageWrapper';

// describe('<EnrollmentVerificationPageWrapper>', () => {
// it('renders the children and required elements', () => {
//   const wrapper = shallow(
//     <EnrollmentVerificationPageWrapper>
//       <div>Test Child</div>
//     </EnrollmentVerificationPageWrapper>,
//   );

//   // Check if the children are rendered
//   expect(wrapper.contains(<div>Test Child</div>)).to.be.true;

//   // Check if the EnrollmentVerificationBreadcrumbs is rendered
//   expect(wrapper.find('EnrollmentVerificationBreadcrumbs').length).to.equal(
//     1,
//   );

//   wrapper.unmount();
// });
describe('<EnrollmentVerificationPageWrapper />', () => {
  it('renders without crashing', () => {
    const { container } = render(<EnrollmentVerificationPageWrapper />);
    expect(container).to.be.not.null;
  });

  // it('renders EnrollmentVerificationBreadcrumbs and ChangeOfDirectDepositWrapper', () => {
  //   const { getByTestId } = render(<EnrollmentVerificationPageWrapper />);
  //   const breadcrumbs = getByTestId('enrollment-verification-breadcrumbs');
  //   const depositWrapper = getByTestId('change-of-direct-deposit-wrapper');

  //   expect(breadcrumbs).to.be.not.null;
  //   expect(depositWrapper).to.be.not.null;
  // });

  // it('renders passed children', () => {
  //   const testChild = <div data-testid="test-child">Test Child</div>;
  //   const { getByTestId } = render(<EnrollmentVerificationPageWrapper>{testChild}</EnrollmentVerificationPageWrapper>);
  //   const childElement = getByTestId('test-child');

  //   expect(childElement).to.be.not.null;
  //   expect(childElement.textContent).to.equal('Test Child');
  // });
});
// });
