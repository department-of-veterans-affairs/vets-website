import get from 'platform/utilities/data/get';
import isEmpty from 'lodash/isEmpty';
import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';
import { replaceRefSchemas } from 'platform/forms-system/src/js/state/helpers';

import {
  fillDateWebComponentPattern,
  shouldNotHaveValidationErrors,
} from './index';
import formConfig from '../../../config/form';

export const shouldIncludePage = (page, data, index) =>
  !Object.hasOwn(page, 'depends') || page.depends(data, index);

export const tabToElement = (
  selector,
  checkInDom = true,
  reverse = false,
  attempt = 0,
) => {
  if (attempt > 6) {
    throw new Error(`Unable to find ${selector} after 6 full searches`);
  }
  if (checkInDom) {
    cy.get(selector).should('exist');
  }

  const key = reverse ? ['Shift', 'Tab'] : 'Tab';
  cy.realPress(key, { pressDelay: 0 }).then(() => {
    cy.document().then(doc => {
      const { activeElement } = doc;
      if (!activeElement) {
        return tabToElement(selector, false, reverse, attempt);
      }

      // if we've reached the continue button, go up
      if (activeElement.id.includes('continueButton')) {
        return tabToElement(selector, false, true, attempt + 1);
      }

      // if we've reached the breadcrumb, go down
      if (activeElement.ariaCurrent === 'page') {
        return tabToElement(selector, false, false, attempt + 1);
      }

      if (
        !activeElement.matches(selector) &&
        !activeElement.matches(selector.replace('Month', ''))
      ) {
        return tabToElement(selector, false, reverse, attempt);
      }

      return activeElement;
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
  if (typeof str !== 'string') {
    return typeEachChar(`${str}`);
  }
  return cy.realType(str);
};

export const fillSelectByTyping = (str, handleFailure, attempt = 0) => {
  if (typeof str !== 'string') {
    return fillSelectByTyping(`${str}`, handleFailure, attempt);
  }

  if (attempt > 3) {
    cy.log(`Unable to enter ${str} in select after 3 tries.`);
    return handleFailure(str);
  }

  return cy
    .get(':focus :selected')
    .should(Cypress._.noop)
    .then($el => {
      const text = $el.text();
      if (text === str || text === `${str}${str}`) return;

      cy.realType(str);

      // Sometimes the select doesn't pick up the first character,
      // causing the wrong option to be selected. Waiting before
      // re-typing the selection mimics user behavior and allows
      // the select to reset the selection process.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(100);
      fillSelectByTyping(str, handleFailure, attempt + 1);
    });
};

export const fillDate = (fieldData, path) => {
  const dateSegments = fieldData.split('-').map(e => e.trim());
  const monthString = new Date(fieldData).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  fillSelectByTyping(monthString, str => {
    // Sometimes CI can take over a minute to press each key,
    // which causes the <select /> to timeout between keypresses,
    // resulting in the selection failing.
    // We must fall back to fillDateWebComponentPattern,
    // which doesn't use the keyboard for selects.
    cy.log(`Failed to enter ${str} in 'fillDate'. Using fallback.`);
    return fillDateWebComponentPattern(path, fieldData);
  });
  cy.realPress('Tab', { pressDelay: 0 });
  typeEachChar(parseInt(dateSegments[2], 10));
  cy.realPress('Tab', { pressDelay: 0 });
  typeEachChar(dateSegments[0]);
};

export const fillInput = (fieldData, onFocusError = () => {}) => {
  cy.document().then(doc => {
    if (doc.activeElement) {
      typeEachChar(fieldData);
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
    fillDate(fieldData, path.join('_'));
    return;
  }

  if (type === 'date') {
    const name = `root_${path.join('_')}`;
    const date = fieldData.split('-').map(v => parseInt(v, 10).toString());
    tabToElement(`#${name}Month`);
    const monthString = new Date(fieldData).toLocaleString('en-US', {
      month: 'long',
      timeZone: 'UTC',
    });
    fillSelectByTyping(monthString, str => {
      throw new Error(`Failed to enter ${str} in 'date'`);
    });
    cy.tabToElement(`#${name}Day`);
    fillSelectByTyping(date[2], str => {
      throw new Error(`Failed to enter ${str} in 'date'`);
    });
    cy.tabToElement(`input[name="${name}Year"]`);
    typeEachChar(date[0]);
    return;
  }

  if (path.includes('powDateRange')) {
    cy.get('input#root_powStatusYesinput').should('be.checked');
  }

  tabToElementByPath(path);

  if (type === 'VaSelectField') {
    const enumName =
      elementSchema.enum && elementSchema.enumNames
        ? elementSchema.enumNames[
            elementSchema.enum.findIndex(value => value === fieldData)
          ]
        : fieldData;
    fillSelectByTyping(enumName, str => {
      throw new Error(`Failed to enter ${str} in 'VaSelectField'`);
    });
  } else if (type === 'VaMemorableDateField') {
    fillDate(fieldData, path.join('_'));
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
      fillSelectByTyping(enumName, str => {
        throw new Error(`Failed to enter ${str} in 'select' or 'va-select`);
      });
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
  Object.entries(schema.properties).forEach(([key, value]) => {
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
            tabToElement('.va-growable-add-btn');
            cy.realPress('Space');
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
  shouldNotHaveValidationErrors();
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
  shouldNotHaveValidationErrors();
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
