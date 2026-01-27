import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = (child = {}) => ({
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [child],
});

describe('686 add child relationship type', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildRelationshipType;

  const { updateSchema } = uiSchema.childrenToAdd.items.relationshipType[
    'ui:options'
  ];

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect($$('va-radio-option', formDOM).length).to.eq(3);
  });

  it('should clear relationship fields when isBiologicalChild is true', () => {
    const testData = formData({
      relationshipType: 'BIOLOGICAL',
      isBiologicalChild: true,
      relationshipToChild: { stepchild: true },
      biologicalParentDob: '2000-01-01',
      biologicalParentName: { first: 'John', last: 'Doe' },
      biologicalParentSsn: '123456789',
      isBiologicalChildOfSpouse: true,
      dateEnteredHousehold: '2020-01-01',
    });

    const updatedSchema = updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
      '',
      testData,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.deep.equal({
      stepchild: false,
      adopted: false,
    });
    expect(testData.childrenToAdd[0].biologicalParentDob).to.be.undefined;
    expect(testData.childrenToAdd[0].biologicalParentName).to.be.undefined;
    expect(testData.childrenToAdd[0].biologicalParentSsn).to.be.undefined;
    expect(testData.childrenToAdd[0].isBiologicalChildOfSpouse).to.be.undefined;
    expect(testData.childrenToAdd[0].dateEnteredHousehold).to.be.undefined;
    expect(updatedSchema).to.equal(schema.properties.childrenToAdd.items);
  });

  it('should not clear fields when isBiologicalChild is false', () => {
    const testData = formData({
      relationshipType: 'STEPCHILD',
      isBiologicalChild: false,
      relationshipToChild: { stepchild: true },
      biologicalParentDob: '2000-01-01',
      biologicalParentName: { first: 'John', last: 'Doe' },
    });

    updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
      '',
      testData,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.deep.equal({
      stepchild: true,
      adopted: false,
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
    const testData = formData({
      relationshipType: '',
      relationshipToChild: { stepchild: true },
      biologicalParentDob: '2000-01-01',
    });

    updateSchema(
      testData,
      schema.properties.childrenToAdd.items,
      uiSchema.childrenToAdd.items,
      0,
      '',
      testData,
    );

    expect(testData.childrenToAdd[0].relationshipToChild).to.deep.equal({
      stepchild: false,
      adopted: false,
    });
    expect(testData.childrenToAdd[0].biologicalParentDob).to.equal(
      '2000-01-01',
    );
  });
});
