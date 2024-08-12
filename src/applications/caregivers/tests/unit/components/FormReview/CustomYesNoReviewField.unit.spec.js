import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomYesNoReviewField from '../../../../components/FormReview/CustomYesNoReviewField';

describe('CG <CustomYesNoReviewField>', () => {
  const getData = ({ formData }) => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(
      <CustomYesNoReviewField>
        <div {...props} />
      </CustomYesNoReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { container, selectors };
  };

  context('when the component renders with value of `Yes`', () => {
    it('should render the correct field title & value', () => {
      const { props } = getData({ formData: true });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text('Yes');
    });
  });

  context('when the component renders with value of `No`', () => {
    it('should render the correct field title & value', () => {
      const { props } = getData({ formData: false });
      const { selectors } = subject({ props });
      expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors().value).to.contain.text('No');
    });
  });
});
