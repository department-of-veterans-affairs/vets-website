import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomYesNoReviewField from '../../../../components/FormReview/CustomYesNoReviewField';

describe('hca <CustomYesNoReviewField>', () => {
  const getData = ({ formData }) => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData,
    },
  });

  context('when the component renders with `Yes` value', () => {
    it('should render the correct field title & value', () => {
      const { props } = getData({ formData: true });
      const { container } = render(
        <CustomYesNoReviewField>
          <div {...props} />
        </CustomYesNoReviewField>,
      );
      const selectors = {
        title: container.querySelector('dt', '.review-row'),
        value: container.querySelector('dd', '.review-row'),
      };
      expect(selectors.title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors.value).to.contain.text('Yes');
    });
  });

  describe('when the component renders with `No` value', () => {
    it('should render the correct field title & value', () => {
      const { props } = getData({ formData: false });
      const { container } = render(
        <CustomYesNoReviewField>
          <div {...props} />
        </CustomYesNoReviewField>,
      );
      const selectors = {
        title: container.querySelector('dt', '.review-row'),
        value: container.querySelector('dd', '.review-row'),
      };
      expect(selectors.title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors.value).to.contain.text('No');
    });
  });
});
