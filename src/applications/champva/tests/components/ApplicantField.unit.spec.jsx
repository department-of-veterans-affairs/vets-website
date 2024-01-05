import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ApplicantField from '../../components/applicant/ApplicantField';

const props = {
  applicantName: {
    first: 'firstname',
    middle: 'middlename',
    last: 'lastname',
    suffix: 'Jr.',
  },
};

const mockStore = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

describe('ApplicantField', () => {
  // TODO: actually check that the applicant's name (from props)
  // are displayed in the component.
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ApplicantField formData={props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
