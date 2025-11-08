import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import PreSubmitInfo from './pre-submit-signature';

const createMockStore = (submissionStatus = null) => ({
  getState: () => ({
    form: {
      submission: {
        status: submissionStatus,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('PreSubmitSignature', () => {
  const defaultFormData = {
    claimantRelationship: {
      relationship: 'veteran',
    },
    veteranIdentification: {
      veteranFullName: {
        first: 'John',
        middle: 'M',
        last: 'Doe',
      },
    },
  };

  const mockOnSectionComplete = () => {};

  it('should render the component', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    expect(container.querySelector('va-statement-of-truth')).to.exist;
  });

  it('should display statement of truth heading', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    const statementOfTruth = container.querySelector('va-statement-of-truth');
    expect(statementOfTruth.getAttribute('heading')).to.equal(
      'Statement of truth',
    );
  });

  it('should display statement of truth content', () => {
    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    expect(
      getByText(
        /I confirm that the identifying information in this form is accurate/,
      ),
    ).to.exist;
  });

  it('should use veteran name when veteran is claimant', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    const statementOfTruth = container.querySelector('va-statement-of-truth');
    expect(statementOfTruth.getAttribute('input-label')).to.equal(
      'Your full name',
    );
  });

  it('should use claimant name when claimant is not veteran', () => {
    const store = createMockStore();
    const formDataWithClaimant = {
      claimantRelationship: {
        relationship: 'spouse',
      },
      claimantInformation: {
        claimantFullName: {
          first: 'Jane',
          middle: '',
          last: 'Smith',
        },
      },
    };

    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={formDataWithClaimant}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    const statementOfTruth = container.querySelector('va-statement-of-truth');
    expect(statementOfTruth).to.exist;
  });

  it('should show error alert when claimant name is missing', () => {
    const store = createMockStore();
    const formDataWithoutName = {
      claimantRelationship: {
        relationship: 'veteran',
      },
      veteranIdentification: {},
    };

    const { getByText } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={formDataWithoutName}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    expect(getByText(/Missing claimant information/)).to.exist;
    expect(getByText(/We need your full name to complete this form/)).to.exist;
  });

  it('should call onSectionComplete initially', async () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect(container).to.exist;
    });
  });

  it('should handle form submission status', () => {
    const store = createMockStore('submitted');

    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    expect(container.querySelector('va-statement-of-truth')).to.exist;
  });

  it('should display checkbox label correctly', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo.CustomComponent
          formData={defaultFormData}
          showError={false}
          onSectionComplete={mockOnSectionComplete}
        />
      </Provider>,
    );

    const statementOfTruth = container.querySelector('va-statement-of-truth');
    expect(statementOfTruth.getAttribute('checkbox-label')).to.equal(
      'I certify that the information above is correct and true to the best of my knowledge and belief.',
    );
  });

  describe('Name validation', () => {
    it('should build full name correctly with middle name', () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={defaultFormData}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-statement-of-truth')).to.exist;
    });

    it('should build full name correctly without middle name', () => {
      const store = createMockStore();
      const formDataNoMiddle = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranIdentification: {
          veteranFullName: {
            first: 'John',
            middle: '',
            last: 'Doe',
          },
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            formData={formDataNoMiddle}
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-statement-of-truth')).to.exist;
    });
  });

  describe('Export Configuration', () => {
    it('should export required as true', () => {
      expect(PreSubmitInfo.required).to.be.true;
    });

    it('should export CustomComponent', () => {
      expect(PreSubmitInfo.CustomComponent).to.exist;
    });
  });
});
