import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};

describe('686 add child relationship part one', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildRelationshipPartOne;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-radio-option').length).to.eq(2);
  });

  it('should clear relationship fields when isBiologicalChild is true', () => {
    const testData = {
      ...formData,
      childrenToAdd: [
        {
          isBiologicalChild: true,
          relationshipToChild: { stepchild: true },
          biologicalParentDob: '2000-01-01',
          biologicalParentName: { first: 'John', last: 'Doe' },
          biologicalParentSsn: '123456789',
          isBiologicalChildOfSpouse: true,
          dateEnteredHousehold: '2020-01-01',
        },
      ],
    };

    const { updateSchema } = uiSchema.childrenToAdd.items['ui:options'];
    const updatedSchema = updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.be.undefined;
    expect(testData.childrenToAdd[0].biologicalParentDob).to.be.undefined;
    expect(testData.childrenToAdd[0].biologicalParentName).to.be.undefined;
    expect(testData.childrenToAdd[0].biologicalParentSsn).to.be.undefined;
    expect(testData.childrenToAdd[0].isBiologicalChildOfSpouse).to.be.undefined;
    expect(testData.childrenToAdd[0].dateEnteredHousehold).to.be.undefined;
    expect(updatedSchema).to.equal(schema.properties.childrenToAdd.items);
  });

  it('should not clear fields when isBiologicalChild is false', () => {
    const testData = {
      ...formData,
      childrenToAdd: [
        {
          isBiologicalChild: false,
          relationshipToChild: { stepchild: true },
          biologicalParentDob: '2000-01-01',
          biologicalParentName: { first: 'John', last: 'Doe' },
        },
      ],
    };

    const { updateSchema } = uiSchema.childrenToAdd.items['ui:options'];
    updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.deep.equal({
      stepchild: true,
    });
    expect(testData.childrenToAdd[0].biologicalParentDob).to.equal(
      '2000-01-01',
    );
    expect(testData.childrenToAdd[0].biologicalParentName).to.deep.equal({
      first: 'John',
      last: 'Doe',
    });
  });

  it('should not clear fields when isBiologicalChild is undefined', () => {
    const testData = {
      ...formData,
      childrenToAdd: [
        {
          relationshipToChild: { stepchild: true },
          biologicalParentDob: '2000-01-01',
        },
      ],
    };

    const { updateSchema } = uiSchema.childrenToAdd.items['ui:options'];
    updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.deep.equal({
      stepchild: true,
    });
    expect(testData.childrenToAdd[0].biologicalParentDob).to.equal(
      '2000-01-01',
    );
  });

  it('should use formData directly when childrenToAdd index does not exist', () => {
    const testData = {
      ...formData,
      isBiologicalChild: true,
      relationshipToChild: { stepchild: true },
      biologicalParentDob: '2000-01-01',
      biologicalParentName: { first: 'John', last: 'Doe' },
      biologicalParentSsn: '123456789',
      isBiologicalChildOfSpouse: true,
      dateEnteredHousehold: '2020-01-01',
      childrenToAdd: [],
    };

    const { updateSchema } = uiSchema.childrenToAdd.items['ui:options'];
    updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
    );

    expect(testData.relationshipToChild).to.be.undefined;
    expect(testData.biologicalParentDob).to.be.undefined;
    expect(testData.biologicalParentName).to.be.undefined;
    expect(testData.biologicalParentSsn).to.be.undefined;
    expect(testData.isBiologicalChildOfSpouse).to.be.undefined;
    expect(testData.dateEnteredHousehold).to.be.undefined;
  });
});
