import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConditionReviewField from '../../components/ConditionReviewField';

const editButton = () => <div>Edit</div>;

describe('ConditionReviewField', () => {
  it('should be empty when no rendered properties', () => {
    const formData = {
      condition: 'Tinnitus',
    };

    const tree = render(
      <ConditionReviewField
        defaultEditButton={editButton}
        formData={formData}
      />,
    );

    expect(tree.queryByText('Edit')).to.be.null;
  });

  it('should render', () => {
    const renderedProperties = <></>;
    const formData = {
      condition: 'Tinnitus',
    };

    const tree = render(
      <ConditionReviewField
        defaultEditButton={editButton}
        formData={formData}
        renderedProperties={renderedProperties}
      />,
    );

    tree.getByText('Edit');
  });
});
