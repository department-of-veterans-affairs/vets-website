import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import RepresentativeReviewField from '../../../../components/FormReview/RepresentativeReviewField';
import content from '../../../../locales/en/content.json';

describe('CG <RepresentativeReviewField>', () => {
  const getData = ({ formData = undefined }) => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(
      <RepresentativeReviewField>
        <div {...props} />
      </RepresentativeReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { container, selectors };
  };

  context('when the component renders with value of `yes`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({ formData: 'yes' });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(
        content['sign-as-rep-yes-text'],
      );
    });
  });

  context('when the component renders with value of `no`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({ formData: 'no' });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(content['sign-as-rep-no-text']);
    });
  });

  context('when the component renders with value of `undefined`', () => {
    it('should render the correct field title & value text', () => {
      const { props } = getData({});
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text(content['sign-as-rep-no-text']);
    });
  });
});
