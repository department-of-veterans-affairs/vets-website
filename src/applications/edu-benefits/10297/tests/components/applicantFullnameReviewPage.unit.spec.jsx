import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ApplicantFullnameReviewPage from '../../components/ApplicantFullnameReviewPage';

const createMockStore = profile => {
  return createStore(() => ({
    user: {
      profile: profile || {},
    },
  }));
};

const renderWithStore = (component, profile) => {
  const store = createMockStore(profile);
  return render(<Provider store={store}>{component}</Provider>);
};
describe('<applicantFullnameReviewPage/>', () => {
  it('should render correctly', () => {
    const mockData = {
      applicantFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
      ssn: '123456789',
      dateOfBirth: '1990-01-01',
    };

    const { container } = renderWithStore(
      <ApplicantFullnameReviewPage data={mockData} />,
      {},
    );

    expect(container.querySelector('.form-review-panel-page')).to.exist;
  });
});
