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

    it('has checkbox group schema for survivors', () => {
      expect(relativesOverview.schema.properties.survivors).to.exist;
    });

    it('has conditional message', () => {
      const { hideIf } = relativesOverview.uiSchema['view:noSurvivorsMessage'][
        'ui:options'
      ];
      expect(hideIf).to.be.a('function');
      expect(hideIf({ survivors: { hasNone: true } })).to.be.false;
      expect(hideIf({ survivors: { hasNone: false } })).to.be.true;
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
  });
});
