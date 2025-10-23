/* eslint-disable react/no-children-prop */
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NoHintReviewField from '../../components/NoHintReviewField';

describe('NoHintReviewField component', () => {
  const setup = (uiTitle, formDataValue) => {
    return render(
      <NoHintReviewField
        children={{
          props: {
            uiSchema: {
              'ui:title': uiTitle,
            },
            formData: formDataValue,
          },
        }}
      />,
    );
  };

  it('should render the title and value correctly', () => {
    const { getByText } = setup('Sample Field Title', 'sample value');
    expect(getByText('Sample Field Title')).to.exist;
    expect(getByText('sample value')).to.exist;
  });

  it('should render empty string when formData is empty', () => {
    const { container } = setup('Sample Field Title', '');
    const dd = container.querySelector('dd');
    expect(dd).to.exist;
    expect(dd.textContent).to.equal('');
    expect(dd.className).to.include('dd-privacy-hidden');
    expect(dd.getAttribute('data-dd-action-name')).to.equal(
      'Sample Field Title',
    );
  });

  it('should render correctly when ui:title is missing', () => {
    const { container } = render(
      <NoHintReviewField
        children={{
          props: {
            uiSchema: {},
            formData: 'sample value',
          },
        }}
      />,
    );

    const dt = container.querySelector('dt');
    const dd = container.querySelector('dd');

    expect(dt).to.exist;
    expect(dt.textContent).to.equal('');
    expect(dd.textContent).to.equal('sample value');
  });
});
