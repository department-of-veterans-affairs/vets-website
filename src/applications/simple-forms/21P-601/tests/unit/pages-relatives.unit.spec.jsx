import { expect } from 'chai';

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import relativesOverview from '../../pages/relativesOverview';
import { relativesPages, relativesOptions } from '../../pages/relativesDetails';

const mockStore = state => createStore(() => state);
const minimalStore = mockStore({
  form: {
    data: {},
  },
});

/**
 * Renders the title method contained in an array builder page.
 * @param {Object} pages Pages object from the array builder
 * @param {String} pageName Stringified keyname of a particular page property we want to inspect
 * @param {String} arrayPath array path of this particular list loop
 * @returns Boolean indicating whether or not the render produced > 0 characters
 */
function callInnerArrayBuilderTitleFunc(pages, pageName, arrayPath) {
  const { container } = render(
    <Provider store={minimalStore}>
      {pages[pageName].uiSchema[arrayPath].items['ui:title']({
        formData: {},
        formContext: {},
      })}
    </Provider>,
  );

  return container.querySelector('h3').innerHTML.length > 0;
}

describe('21P-601 relatives page configurations', () => {
  describe('relativesOverview', () => {
    it('exports uiSchema and schema', () => {
      expect(relativesOverview).to.have.property('uiSchema');
      expect(relativesOverview).to.have.property('schema');
    });

    it('has survivors field', () => {
      expect(relativesOverview.uiSchema).to.have.property('survivors');
      expect(relativesOverview.schema.properties).to.have.property('survivors');
    });

    it('has yesNo schema for survivors', () => {
      expect(relativesOverview.schema.properties.survivors).to.exist;
      expect(relativesOverview.schema.properties.survivors).to.have.property(
        'type',
        'boolean',
      );
    });

    it('has correct schema structure', () => {
      expect(relativesOverview.schema).to.have.property('type', 'object');
      expect(relativesOverview.schema).to.have.property('properties');
      expect(relativesOverview.schema.properties).to.have.property(
        'view:survivorsMessage',
      );
      expect(
        relativesOverview.schema.properties['view:survivorsMessage'],
      ).to.have.property('type', 'object');
    });

    it('has title UI configuration', () => {
      const titleConfig = relativesOverview.uiSchema['ui:title'];
      expect(titleConfig).to.exist;
      // titleUI returns a React component, not a string
      expect(titleConfig).to.not.be.a('string');
    });

    it('has survivors yesNoUI configuration', () => {
      const survivorsUI = relativesOverview.uiSchema.survivors;
      expect(survivorsUI).to.exist;
      expect(survivorsUI['ui:required']).to.be.a('function');
      expect(survivorsUI['ui:required']()).to.be.true;
      expect(survivorsUI['ui:title']).to.equal(
        'Are there any dependent survivors of the beneficiary?',
      );
      expect(survivorsUI['ui:webComponentField']).to.exist;
    });

    it('has conditional message', () => {
      const { hideIf } = relativesOverview.uiSchema['view:survivorsMessage'][
        'ui:options'
      ];
      expect(hideIf).to.be.a('function');
      expect(hideIf({ survivors: false })).to.be.true;
      expect(hideIf({ survivors: true })).to.be.false;
    });

    it('hides message when other options are selected', () => {
      const { hideIf } = relativesOverview.uiSchema['view:survivorsMessage'][
        'ui:options'
      ];
      expect(hideIf({ survivors: false })).to.be.true;
      expect(hideIf({ survivors: undefined })).to.be.true;
    });

    it('has view:survivorsMessage with empty properties', () => {
      const messageSchema =
        relativesOverview.schema.properties['view:survivorsMessage'];
      expect(messageSchema).to.have.property('properties');
      expect(messageSchema.properties).to.be.an('object');
      expect(Object.keys(messageSchema.properties)).to.have.lengthOf(0);
    });
  });

  describe('relativesDetails (array builder)', () => {
    it('exports array builder pages object', () => {
      expect(relativesPages).to.be.an('object');
      expect(relativesPages).to.have.property('relativesSummary');
      expect(relativesPages).to.have.property('relativeNamePage');
      expect(relativesPages).to.have.property('relativeAddressPage');
    });

    it('summary page has correct structure', () => {
      expect(relativesPages.relativesSummary).to.have.property('path');
      expect(relativesPages.relativesSummary.path).to.equal(
        'relatives-information',
      );
      expect(relativesPages.relativesSummary).to.have.property('uiSchema');
      expect(relativesPages.relativesSummary).to.have.property('schema');
    });

    it('summary page has required schema property', () => {
      expect(
        relativesPages.relativesSummary.schema.properties,
      ).to.have.property('view:hasRelatives');
      expect(relativesPages.relativesSummary.schema.required).to.include(
        'view:hasRelatives',
      );
    });

    it('summary page has array builder UI', () => {
      expect(relativesPages.relativesSummary.uiSchema).to.have.property(
        'view:hasRelatives',
      );
    });

    it('relativeNamePage has correct path with index', () => {
      expect(relativesPages.relativeNamePage.path).to.include(':index');
      expect(relativesPages.relativeNamePage.path).to.include('details');
    });

    it('relativeNamePage has proper schema structure', () => {
      expect(
        relativesPages.relativeNamePage.schema.properties,
      ).to.have.property('survivingRelatives');
      const itemSchema =
        relativesPages.relativeNamePage.schema.properties.survivingRelatives
          .items;
      expect(itemSchema.properties).to.have.property('fullName');
      expect(itemSchema.properties).to.have.property('relationship');
      expect(itemSchema.properties).to.have.property('dateOfBirth');
    });

    it('relativeNamePage requires fullName and relationship', () => {
      const itemSchema =
        relativesPages.relativeNamePage.schema.properties.survivingRelatives
          .items;
      expect(itemSchema.required).to.include('fullName');
      expect(itemSchema.required).to.include('relationship');
    });

    it('relativeAddressPage has correct path with index', () => {
      expect(relativesPages.relativeAddressPage.path).to.include(':index');
      expect(relativesPages.relativeAddressPage.path).to.include('address');
    });

    it('relativeAddressPage has address field', () => {
      expect(
        relativesPages.relativeAddressPage.schema.properties,
      ).to.have.property('survivingRelatives');
      const itemSchema =
        relativesPages.relativeAddressPage.schema.properties.survivingRelatives
          .items;
      expect(itemSchema.properties).to.have.property('address');
    });

    it('all pages have title property', () => {
      expect(relativesPages.relativesSummary).to.have.property('title');
      expect(relativesPages.relativeNamePage).to.have.property('title');
      expect(relativesPages.relativeAddressPage).to.have.property('title');
      expect(
        callInnerArrayBuilderTitleFunc(
          relativesPages,
          'relativeAddressPage',
          'survivingRelatives',
        ),
      ).to.be.true;
    });

    it('calls getItemName with full name', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { first: 'John', middle: 'A', last: 'Doe' },
      });
      expect(result).to.equal('John A Doe');
    });

    it('calls getItemName with partial name', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { middle: 'A', last: 'Doe' },
      });
      expect(result).to.equal('A Doe');

      const result2 = relativesOptions.text.getItemName({
        fullName: { first: 'John', middle: 'A' },
      });
      expect(result2).to.equal('John A');
    });

    it('calls getItemName with no name', () => {
      const result = relativesOptions.text.getItemName({ fullName: null });
      expect(result).to.equal('Unknown relative');
    });

    it('calls getItemName with partial name', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { first: 'Jane', last: 'Smith' },
      });
      expect(result).to.equal('Jane Smith');
    });

    it('calls cardDescription with relationship and dob', () => {
      const result = relativesOptions.text.cardDescription({
        relationship: 'child',
        dateOfBirth: '1990-01-01',
      });
      expect(result).to.equal('Child • Born: 1990-01-01');
    });

    it('calls cardDescription without dob', () => {
      const result = relativesOptions.text.cardDescription({
        relationship: 'spouse',
      });
      expect(result).to.equal('Spouse');
    });

    it('calls isItemIncomplete with incomplete item', () => {
      const result = relativesOptions.isItemIncomplete({
        fullName: null,
        relationship: 'spouse',
      });
      expect(result).to.be.true;
    });

    it('calls isItemIncomplete with complete item', () => {
      const result = relativesOptions.isItemIncomplete({
        fullName: { first: 'John' },
        relationship: 'child',
      });
      expect(result).to.be.false;
    });

    it('calls isItemIncomplete with missing relationship', () => {
      const result = relativesOptions.isItemIncomplete({
        fullName: { first: 'John', last: 'Doe' },
        relationship: null,
      });
      expect(result).to.be.true;
    });

    it('calls isItemIncomplete with undefined item', () => {
      const result = relativesOptions.isItemIncomplete(undefined);
      expect(result).to.be.true;
    });

    it('calls isItemIncomplete with missing both fullName and relationship', () => {
      const result = relativesOptions.isItemIncomplete({});
      expect(result).to.be.true;
    });

    it('calls getItemName with undefined item', () => {
      const result = relativesOptions.text.getItemName(undefined);
      expect(result).to.equal('Unknown relative');
    });

    it('calls getItemName with empty fullName object', () => {
      const result = relativesOptions.text.getItemName({
        fullName: {},
      });
      expect(result).to.equal('');
    });

    it('calls getItemName with only first name', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { first: 'John' },
      });
      expect(result).to.equal('John');
    });

    it('calls getItemName with only last name', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { last: 'Doe' },
      });
      expect(result).to.equal('Doe');
    });

    it('calls getItemName with extra spaces', () => {
      const result = relativesOptions.text.getItemName({
        fullName: { first: '  John  ', middle: '', last: '  Doe  ' },
      });
      expect(result).to.equal('John Doe');
    });

    it('calls cardDescription with unknown relationship', () => {
      const result = relativesOptions.text.cardDescription({
        relationship: 'other',
        dateOfBirth: '1980-05-15',
      });
      expect(result).to.equal('other • Born: 1980-05-15');
    });

    it('calls cardDescription with no relationship and no dob', () => {
      const result = relativesOptions.text.cardDescription({});
      expect(result).to.equal('');
    });

    it('calls cardDescription with parent relationship', () => {
      const result = relativesOptions.text.cardDescription({
        relationship: 'parent',
      });
      expect(result).to.equal('Parent');
    });

    it('relativeAddressPage title function returns title with full name', () => {
      const titleFn =
        relativesPages.relativeAddressPage.uiSchema.survivingRelatives.items[
          'ui:title'
        ];
      expect(titleFn).to.be.a('function');
      const result = titleFn({
        formData: { fullName: { first: 'John', last: 'Smith' } },
      });
      expect(result).to.exist;
    });

    it('relativeAddressPage title function returns title with only first name', () => {
      const titleFn =
        relativesPages.relativeAddressPage.uiSchema.survivingRelatives.items[
          'ui:title'
        ];
      expect(titleFn).to.be.a('function');
      const result = titleFn({
        formData: { fullName: { first: 'John' } },
      });
      expect(result).to.exist;
    });

    it('relativeAddressPage title function returns title with no name', () => {
      const titleFn =
        relativesPages.relativeAddressPage.uiSchema.survivingRelatives.items[
          'ui:title'
        ];
      expect(titleFn).to.be.a('function');
      const result = titleFn({ formData: {} });
      expect(result).to.exist;
    });

    it('relativeAddressPage title function returns title with empty fullName object', () => {
      const titleFn =
        relativesPages.relativeAddressPage.uiSchema.survivingRelatives.items[
          'ui:title'
        ];
      expect(titleFn).to.be.a('function');
      const result = titleFn({
        formData: { fullName: {} },
      });
      expect(result).to.exist;
    });

    it('verifies maxItems is set to 4', () => {
      expect(relativesOptions.maxItems).to.equal(4);
    });

    it('verifies arrayPath is survivingRelatives', () => {
      expect(relativesOptions.arrayPath).to.equal('survivingRelatives');
    });

    it('verifies required is false', () => {
      expect(relativesOptions.required).to.equal(false);
    });
  });
});
