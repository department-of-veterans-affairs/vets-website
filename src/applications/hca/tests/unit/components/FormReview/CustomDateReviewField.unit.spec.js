import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomDateReviewField from '../../../../components/FormReview/CustomDateReviewField';

describe('hca <CustomDateReviewField>', () => {
  const getData = () => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData: new Date('2020-5-15'),
    },
  });

  context('when the component renders', () => {
    it('should render the correct title & date format', () => {
      const { props } = getData();
      const { container } = render(
        <CustomDateReviewField>
          <div {...props} />
        </CustomDateReviewField>,
      );
      const selectors = {
        title: container.querySelector('dt', '.review-row'),
        date: container.querySelector('dd', '.review-row'),
      };
      expect(selectors.title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors.date).to.contain.text('05/15/2020');
    });
  });
});
