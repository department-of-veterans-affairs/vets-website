import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import veteranInformation from '../../pages/veteranInformation';

const mockStore = {
  getState: () => ({
    user: {
      profile: {
        userFullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
          suffix: 'Jr.',
        },
        dob: '1980-01-01',
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('Confirm Veteran Details', () => {
  it('should render Veteran details', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={veteranInformation.schema}
          uiSchema={veteranInformation.uiSchema}
          data={{}}
          formData={{}}
          setFormData={() => {}}
        />
      </Provider>,
    );

    expect(container.querySelector('va-card')).to.exist;
    expect(container.textContent).to.include('Personal information');
  });
});
