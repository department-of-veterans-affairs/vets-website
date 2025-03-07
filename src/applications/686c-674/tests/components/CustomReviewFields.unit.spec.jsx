import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NoHintReviewField from '../../components/CustomReviewFields';

describe('NoHintReviewField Component', () => {
  const uiSchema = {
    'ui:title': 'Test Title',
  };
  const formData = 'Test Data';

  const children = {
    props: {
      uiSchema,
      formData,
    },
  };

  it('renders the component with correct title and data', () => {
    const { getByText } = render(
      <NoHintReviewField>{children}</NoHintReviewField>,
    );

    expect(getByText('Test Title')).to.exist;
    expect(getByText('Test Data')).to.exist;
  });

  it('renders with correct class names', () => {
    const { container } = render(
      <NoHintReviewField>{children}</NoHintReviewField>,
    );

    expect(container.firstChild).to.have.class('review-row');
  });

  it('renders without crashing', () => {
    const { container } = render(
      <NoHintReviewField>{children}</NoHintReviewField>,
    );

    expect(container).to.exist;
  });

  it('handles empty formData', () => {
    const { getByText } = render(
      <NoHintReviewField>
        {{
          ...children,
          props: {
            ...children.props,
            formData: '',
          },
        }}
      </NoHintReviewField>,
    );

    expect(getByText('Test Title')).to.exist;
  });

  it('renders correctly when uiSchema title is not provided', () => {
    const { container } = render(
      <NoHintReviewField>
        {{
          ...children,
          props: {
            ...children.props,
            uiSchema: {},
          },
        }}
      </NoHintReviewField>,
    );

    expect(container.querySelector('dt').textContent).to.equal('');
  });
});
