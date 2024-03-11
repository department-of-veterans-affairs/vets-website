import get from 'platform/utilities/data/get';
import isEmpty from 'lodash/isEmpty';
import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';
import { replaceRefSchemas } from 'platform/forms-system/src/js/state/helpers';

import formConfig from '../../../config/form';

export const shouldIncludePage = (page, data, index) =>
  !Object.hasOwn(page, 'depends') || page.depends(data, index);

export const tabToElement = selector => {
  cy.get(selector).should('exist');

  cy.realPress('Tab', { pressDelay: 0 }).then(() => {
    cy.document().then(doc => {
      if (doc.activeElement.tagName.toLowerCase() !== 'body') {
        return cy.get(':focus').then($el => {
          if (!$el.is(selector) && !$el.find(selector).length) {
            tabToElement(selector);
          }
        });
      }
      return tabToElement(selector);
    });
  });
};

export const tabToElementByPath = (path, suffix = '') => {
  const selector = `[name="root_${path.join('_')}${suffix}"]`;
  tabToElement(selector);
};

export const getComponentType = (parentUi, elementUi, schemaType) => {
  const suffix = get('ui:options.yesNoReverse', elementUi) ? '-reverse' : '';
  const parentWebComponentType = get('ui:webComponentField.name', parentUi);
  if (parentWebComponentType === 'VaCheckboxGroupField') {
    return 'VaCheckboxField';
  }
  const webComponentType = get('ui:webComponentField.name', elementUi);
  if (webComponentType) return `${webComponentType}${suffix}`;
  if (get('ui:widget', elementUi)) {
    return `${get('ui:widget', elementUi)}${suffix}`;
  }
  return `${schemaType}${suffix}`;
};

export const typeEachChar = str => {
  for (const character of `${str}`) {
    cy.realPress(character);
  }
};

export const fillSelectByTyping = str => {
  cy.get(':focus :selected')
    .should(Cypress._.noop)
    .then($el => {
      const text = $el.text();
      if (!text.includes(str)) {
        // Sometimes the select doesn't pick up the first character,
        // causing the wrong option to be selected. Waiting before
        // re-typing the selection mimics user behavior and allows
        // the select to reset the selection process..
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        typeEachChar(str);

        fillSelectByTyping(str);
      }
    });
};

export const fillDate = fieldData => {
  const dateSegments = fieldData.split('-').map(e => e.trim());
  const monthString = new Date(fieldData).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  fillSelectByTyping(monthString);
  cy.realPress('Tab', { pressDelay: 0 });
  typeEachChar(parseInt(dateSegments[2], 10));
  cy.realPress('Tab', { pressDelay: 0 });
  typeEachChar(dateSegments[0]);
};

export const fillInput = (fieldData, onFocusError = () => {}) => {
  cy.document().then(doc => {
    if (doc.activeElement?.tagName.toLowerCase() === 'input') {
      cy.get(':focus').type(fieldData, { delay: 0 });
    } else if (doc.activeElement) {
      cy.get(':focus')
        .find('input')
        .type(fieldData, { delay: 0 });
    } else {
      // Sometimes elements lose focus after tabbing to them,
      // causing the `get(':focus')` command to fail.
      // An optional callback allows us to retry.
      onFocusError();
    }
  });
};

const pagePerItemArrays = ['marriages', 'dependents'];
const isPagePerItem = (path, showPagePerItem) =>
  showPagePerItem && path.length > 1;
export const filterPagePerItemPath = path =>
  path.filter(p => !pagePerItemArrays.includes(p) && !Number.isInteger(p));

export const fillField = ({
  fieldData,
  elementSchema,
  type,
  elementPath,
  showPagePerItem,
}) => {
  const path = isPagePerItem(elementPath, showPagePerItem)
    ? filterPagePerItemPath(elementPath)
    : elementPath;

  if (path.includes('dateOfMarriage') || path.includes('dateOfSeparation')) {
    tabToElementByPath(path, 'Month');
    fillDate(fieldData);
    return;
  }

  if (type === 'date') {
    cy.typeInDate(`#root_${path.join('_')}`, fieldData);
    return;
  }

  tabToElementByPath(path);

  if (type === 'VaSelectField') {
    const enumName =
      elementSchema.enum && elementSchema.enumNames
        ? elementSchema.enumNames[
            elementSchema.enum.findIndex(value => value === fieldData)
          ]
        : fieldData;
    fillSelectByTyping(enumName);
  } else if (type === 'VaMemorableDateField') {
    fillDate(fieldData);
  } else if (type === 'YesNoField' || type === 'yesNo') {
    cy.chooseRadio(fieldData ? 'Y' : 'N');
  } else if (type === 'YesNoField-reverse' || type === 'yesNo-reverse') {
    cy.chooseRadio(fieldData ? 'N' : 'Y');
  } else if (type === 'VaRadioField' || type === 'radio') {
    cy.chooseRadio(fieldData);
  } else if (type === 'VaCheckboxField' || type === 'boolean') {
    cy.get(':focus').then($el => {
      if ($el[0].checked !== fieldData) {
        cy.realPress('Space');
      }
    });
  } else {
    fillInput(fieldData, () => {
      tabToElementByPath(path);
      fillInput(fieldData);
    });
  }
};

export const fillStateField = (path, schema, uiSchema, data) => {
  const stateSchema = get(`state.ui:options`, uiSchema).replaceSchema(
    data,
    schema,
    uiSchema,
    0,
    path,
  );

  tabToElementByPath(
    path.includes('dependents') ? filterPagePerItemPath(path) : path,
  );
  const fieldData = get(path.join('.'), data);
  const enumName =
    stateSchema.enum && stateSchema.enumNames
      ? stateSchema.enumNames[
          stateSchema.enum.findIndex(value => value === fieldData)
        ]
      : fieldData;
  cy.document().then(doc => {
    const tagName = doc.activeElement?.tagName?.toLowerCase();
    if (tagName === 'select' || tagName === 'va-select') {
      cy.chooseSelectOptionByTyping(enumName);
    } else {
      fillInput(fieldData);
    }
  });
};

export const fillSchema = ({
  schema,
  uiSchema,
  showPagePerItem,
  data,
  path = [],
}) => {
  const isInitiallyHidden = k => get(`${k}.ui:options.expandUnder`, uiSchema);
  const entries = Object.entries(schema.properties);
  const hiddenEntries = entries.filter(([k, _v]) => isInitiallyHidden(k));
  const shownEntries = entries.filter(([k, _v]) => !isInitiallyHidden(k));
  [...shownEntries, ...hiddenEntries].forEach(([key, value]) => {
    const elementPath = [...path, key];
    const elementSchema = value.$ref
      ? replaceRefSchemas(value, formConfig.defaultDefinitions)
      : value;
    const elementUiSchema = get(key, uiSchema) || {};
    const elementData = get(elementPath.join('.'), data);
    if (elementData === undefined) return;
    if (key === 'homeAcreageValue') {
      tabToElement('[name="home-acreage-value"]');
      fillInput(elementData, () => {
        tabToElement('[name="home-acreage-value"]');
        fillInput(elementData);
      });
    } else if (key === 'state') {
      fillStateField(elementPath, schema, uiSchema, data);
    } else if (elementSchema.type === 'object') {
      if (!isEmpty(elementSchema.properties)) {
        fillSchema({
          schema: elementSchema,
          uiSchema: elementUiSchema,
          path: elementPath,
          showPagePerItem,
          data,
        });
      }
    } else if (elementSchema.type === 'array') {
      if (get('ui:widget', elementUiSchema) === ArrayCountWidget) {
        fillField({
          fieldData: elementData.length,
          type: 'number',
          elementPath,
          showPagePerItem,
        });
      } else {
        elementData.forEach((_data, i) => {
          if (i !== 0) {
            cy.tabToElementAndPressSpace('.va-growable-add-btn');
          }
          fillSchema({
            schema: elementSchema.items,
            uiSchema: elementUiSchema.items,
            path: [...elementPath, i],
            showPagePerItem,
            data,
          });
        });
      }
    } else {
      const type = getComponentType(
        uiSchema,
        elementUiSchema,
        elementSchema.type,
      );
      fillField({
        fieldData: elementData,
        elementSchema,
        type,
        elementPath,
        showPagePerItem,
      });
    }
  });
};

const keyboardTestArrayPage = (page, data, fieldKey, i) => {
  if (!shouldIncludePage(page, data, i)) {
    return;
  }

  cy.url().should('include', page.path.replace(':index', i));
  cy.axeCheck();

  fillSchema({
    schema: get(`schema.properties.${fieldKey}.items`, page),
    uiSchema: get(`uiSchema.${fieldKey}.items`, page),
    path: [fieldKey, i],
    showPagePerItem: page.showPagePerItem,
    data,
  });
  cy.tabToContinueForm();
};

export const keyboardTestArrayPages = (page, chapter, data) => {
  let fieldKey = null;
  Object.entries(page.schema.properties).forEach(([key, value]) => {
    if (value.type === 'array') {
      fieldKey = key;
    }
  });
  const collatedPages = page.showPagePerItem
    ? Object.values(chapter.pages).filter(
        p => p.showPagePerItem && p.arrayPath === fieldKey,
      )
    : [page];
  get(fieldKey, data)?.forEach((_dataItem, i) => {
    collatedPages.forEach(p => {
      keyboardTestArrayPage(p, data, fieldKey, i);
    });
  });
  return collatedPages.map(p => p.path);
};

export const keyboardTestPage = (page, data) => {
  if (!shouldIncludePage(page, data)) {
    return [];
  }

  cy.url().should('include', page.path);
  cy.axeCheck();

  fillSchema({ schema: page.schema, uiSchema: page.uiSchema, data });
  cy.tabToContinueForm();
  return [page.path];
};

export const startForm = () => {
  cy.url().should('include', '/introduction');
  cy.tabToElement('.schemaform-start-button');
  cy.realPress('Enter');
};

export const fillReviewPage = data => {
  cy.url().should('include', '/review-and-submit');
  cy.tabToElement('[name="veteran-signature"]');
  const name = get('veteranFullName', data);
  const signature = `${name.first} ${name.middle} ${name.last}`;
  fillInput(signature);
  cy.tabToElement('[name="veteran-certify"]');
  cy.get(':focus').then($el => {
    if ($el[0].checked !== true) {
      cy.realPress('Space');
    }
  });
  cy.tabToSubmitForm();
};
