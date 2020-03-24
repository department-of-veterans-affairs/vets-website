import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SameOfficeReviewField from '../../containers/SameOfficeReviewField';

const uiSchema = { 'ui:title': 'Test' };
const Element = ({ formData }) => <div formData={formData} />;

describe('Schemaform <SameOfficeReviewField>', () => {
  it('should render title', () => {
    const tree = SkinDeep.shallowRender(
      <SameOfficeReviewField uiSchema={uiSchema} />,
    );
    expect(tree.subTree('dt').text()).to.equal('Test');
  });
  it('should render "Yes" for truthy values', () => {
    const tree = SkinDeep.shallowRender(
      <SameOfficeReviewField uiSchema={uiSchema}>
        <Element formData />
      </SameOfficeReviewField>,
    );
    expect(tree.subTree('dd').text()).to.equal('Yes');
  });
  it('should render "No" for falsy values', () => {
    const tree = SkinDeep.shallowRender(
      <SameOfficeReviewField uiSchema={uiSchema}>
        <Element formData={false} />
      </SameOfficeReviewField>,
    );
    expect(tree.subTree('dd').text()).to.equal('No');
  });
});
