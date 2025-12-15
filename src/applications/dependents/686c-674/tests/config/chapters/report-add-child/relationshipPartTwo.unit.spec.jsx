import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();
const baseFormData = {
  'view:selectable686Options': { addChild: true },
  childrenToAdd: [{}],
};

describe('686 add child relationship step two', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildRelationshipPartTwo;

  afterEach(cleanup);

  it('should render both checkboxes', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('va-checkbox').length).to.eq(2);

    const group = formDOM.querySelector('va-checkbox-group');
    expect(group).to.exist;
    expect(group.getAttribute('label')).to.include(
      'What’s your relationship to this child?',
    );
  });

  it('should require at least one relationship', async () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    const submit = formDOM.querySelector('button[type="submit"]');
    submit.click();

    await waitFor(() => {
      const group = formDOM.querySelector('va-checkbox-group');
      expect(group).to.exist;
      expect(group.getAttribute('error')).to.include(
        'Select at least one relationship.',
      );
    });
  });

  it('should display evidence info when adopted is checked', async () => {
    const checkedData = {
      ...baseFormData,
      relationshipToChild: { adopted: true },
    };
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={checkedData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(form.container.textContent).to.include(
        'Based on your answers, you’ll need to submit additional evidence',
      );
      expect(form.container.textContent).to.include(
        'The final decree of adoption',
      );
    });
  });

  it('should display stepchild evidence info when stepchild is checked', async () => {
    const checkedData = {
      ...baseFormData,
      relationshipToChild: { stepchild: true },
    };
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={checkedData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(form.container.textContent).to.include(
        'You’ll need to submit a copy of your child’s birth certificate',
      );
    });
  });

  describe('updateSchema functionality', () => {
    it('should clear biological parent fields when stepchild is not checked', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [
          {
            relationshipToChild: { adopted: true },
            biologicalParentDob: '2000-01-01',
            biologicalParentName: { first: 'John', last: 'Doe' },
            biologicalParentSsn: '123456789',
            isBiologicalChildOfSpouse: true,
            dateEnteredHousehold: '2020-01-01',
          },
        ],
      };

      const { updateSchema } = uiSchema.childrenToAdd.items.relationshipToChild[
        'ui:options'
      ];
      updateSchema(
        testData,
        schema.properties.childrenToAdd.items,
        uiSchema.childrenToAdd.items,
        0,
      );

      expect(testData.childrenToAdd[0].biologicalParentDob).to.be.undefined;
      expect(testData.childrenToAdd[0].biologicalParentName).to.be.undefined;
      expect(testData.childrenToAdd[0].biologicalParentSsn).to.be.undefined;
      expect(testData.childrenToAdd[0].isBiologicalChildOfSpouse).to.be
        .undefined;
      expect(testData.childrenToAdd[0].dateEnteredHousehold).to.be.undefined;
    });

    it('should preserve biological parent fields when stepchild is checked', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [
          {
            relationshipToChild: { stepchild: true },
            biologicalParentDob: '2000-01-01',
            biologicalParentName: { first: 'John', last: 'Doe' },
            biologicalParentSsn: '123456789',
            isBiologicalChildOfSpouse: true,
            dateEnteredHousehold: '2020-01-01',
          },
        ],
      };

      const { updateSchema } = uiSchema.childrenToAdd.items.relationshipToChild[
        'ui:options'
      ];
      updateSchema(
        testData,
        schema.properties.childrenToAdd.items,
        uiSchema.childrenToAdd.items,
        0,
      );

      expect(testData.childrenToAdd[0].biologicalParentDob).to.equal(
        '2000-01-01',
      );
      expect(testData.childrenToAdd[0].biologicalParentName).to.deep.equal({
        first: 'John',
        last: 'Doe',
      });
      expect(testData.childrenToAdd[0].biologicalParentSsn).to.equal(
        '123456789',
      );
      expect(testData.childrenToAdd[0].isBiologicalChildOfSpouse).to.be.true;
      expect(testData.childrenToAdd[0].dateEnteredHousehold).to.equal(
        '2020-01-01',
      );
    });

    it('should clear fields when relationshipToChild is undefined', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [
          {
            biologicalParentDob: '2000-01-01',
            biologicalParentName: { first: 'John', last: 'Doe' },
          },
        ],
      };

      const { updateSchema } = uiSchema.childrenToAdd.items.relationshipToChild[
        'ui:options'
      ];
      updateSchema(
        testData,
        schema.properties.childrenToAdd.items,
        uiSchema.childrenToAdd.items,
        0,
      );

      expect(testData.childrenToAdd[0].biologicalParentDob).to.be.undefined;
      expect(testData.childrenToAdd[0].biologicalParentName).to.be.undefined;
    });

    it('should use formData directly when childrenToAdd index does not exist', () => {
      const testData = {
        ...baseFormData,
        relationshipToChild: { adopted: true },
        biologicalParentDob: '2000-01-01',
        biologicalParentName: { first: 'John', last: 'Doe' },
        biologicalParentSsn: '123456789',
        childrenToAdd: [],
      };

      const { updateSchema } = uiSchema.childrenToAdd.items.relationshipToChild[
        'ui:options'
      ];
      updateSchema(
        testData,
        schema.properties.childrenToAdd.items,
        uiSchema.childrenToAdd.items,
        0,
      );

      expect(testData.biologicalParentDob).to.be.undefined;
      expect(testData.biologicalParentName).to.be.undefined;
      expect(testData.biologicalParentSsn).to.be.undefined;
    });
  });

  describe('hideIf logic for evidence sections', () => {
    it('should hide common evidence when no relationship is selected', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [{}],
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:commonEvidenceInfo'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.true;
    });

    it('should show common evidence when adopted is selected', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [{ relationshipToChild: { adopted: true } }],
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:commonEvidenceInfo'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.false;
    });

    it('should show common evidence when stepchild is selected', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [{ relationshipToChild: { stepchild: true } }],
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:commonEvidenceInfo'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.false;
    });

    it('should hide stepchild evidence when stepchild is not selected', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [{ relationshipToChild: { adopted: true } }],
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:stepchildAdditionalEvidenceDescription'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.true;
    });

    it('should show stepchild evidence when stepchild is selected', () => {
      const testData = {
        ...baseFormData,
        childrenToAdd: [{ relationshipToChild: { stepchild: true } }],
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:stepchildAdditionalEvidenceDescription'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.false;
    });

    it('should handle edit mode for evidence sections', () => {
      const testData = {
        ...baseFormData,
        relationshipToChild: { adopted: true },
      };

      const { hideIf } = uiSchema.childrenToAdd.items[
        'view:adoptedAdditionalEvidenceDescription'
      ]['ui:options'];
      expect(hideIf(testData, 0)).to.be.false;
    });
  });
});
