import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomReviewField from '../../../../components/FormReview/CustomReviewField';

describe('hca <CustomReviewField>', () => {
  const getData = () => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData: 'Value',
    },
  });

  context('when the component renders', () => {
    it('should render the correct field title & value', () => {
      const { props } = getData();
      const { container } = render(
        <CustomReviewField>
          <div {...props} />
        </CustomReviewField>,
      );
      const selectors = {
        title: container.querySelector('dt', '.review-row'),
        value: container.querySelector('dd', '.review-row'),
      };
      expect(selectors.title).to.contain.text(props.uiSchema['ui:title']);
      expect(selectors.value).to.contain.text(props.formData);
    });
  });
});
