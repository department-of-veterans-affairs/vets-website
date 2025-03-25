import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RepresentativeReviewField from '../../../../components/FormReview/RepresentativeReviewField';
import content from '../../../../locales/en/content.json';

describe('CG <RepresentativeReviewField>', () => {
  const uiTitle = 'Review Field Title';
  const subject = ({ formData = undefined } = {}) => {
    const props = {
      uiSchema: { 'ui:title': uiTitle },
      formData,
    };
    const { container } = render(
      <RepresentativeReviewField>
        <div {...props} />
      </RepresentativeReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { selectors };
  };

  it('should render the correct field title & value text when the component renders with value of `yes`', () => {
    const { selectors } = subject({ formData: 'yes' });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-yes-text']);
  });

  it('should render the correct field title & value text when the component renders with value of `no`', () => {
    const { selectors } = subject({ formData: 'no' });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-no-text']);
  });

  it('should render the correct field title & value text when the component renders with value of `undefined`', () => {
    const { selectors } = subject();
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(content['sign-as-rep-no-text']);
  });
});
