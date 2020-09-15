import {
  APP_SELECTOR,
  ARRAY_ITEM_SELECTOR,
  FIELD_SELECTOR,
  FORCE_OPTION,
  NO_LOG_OPTION,
} from '../index';

/**
 * Checks if the current page maps to an array page from the form config,
 * and if there is a match, build the path prefix for looking up test data
 * with the index of the array item that corresponds to this page.
 *
 * @param {string} pathname - The pathname of the current page.
 */
const getArrayItemPath = pathname => {
  cy.get('@arrayPages', NO_LOG_OPTION).then(arrayPages => {
    let index;

    const { arrayPath } =
      arrayPages.find(({ regex }) => {
        const match = pathname.match(regex);
        if (match) [, index] = match;
        return match;
      }) || {};

    return arrayPath ? `${arrayPath}[${parseInt(index, 10)}]` : '';
  });
};

/**
 * Adds a new item for every array type field on the current page
 * that still has more array items to be added and filled out.
 *
 * @param {Element} $form - The form element returned from querying the DOM.
 */
const addNewArrayItem = $form => {
  // Get all array types on the current page.
  const arrayTypeRoots = $form.find('div[name^="topOfTable_root_"]');

  // Find the last entry for each array type, use its index to figure out
  // whether the test data still has more items to be entered, and click
  // the add button if so.
  if (arrayTypeRoots.length) {
    cy.wrap(arrayTypeRoots).each(arrayTypeRoot => {
      cy.wrap(arrayTypeRoot)
        .siblings('div')
        .last()
        .find('div[name^="table_root_"]')
        .then(lastArrayItemRoot => {
          const key = arrayTypeRoot.attr('name').replace('topOfTable_', '');

          cy.findData({ key }).then(arrayData => {
            if (typeof arrayData !== 'undefined') {
              const lastIndex = parseInt(
                lastArrayItemRoot.attr('name').match(/\d+$/g),
                10,
              );

              if (arrayData.length - 1 > lastIndex) {
                cy.wrap(arrayTypeRoot)
                  .siblings('button.va-growable-add-btn')
                  .first()
                  .click(FORCE_OPTION);
              }
            }
          });
        });
    });
  }
};

/**
 * Builds an object from a form field with attributes that are used
 * to look up test data and enter that data into the field.
 *
 * typedef {Object} Field
 * @property {Element} element - A form field element.
 * @property {string} key - String that is used for data lookup.
 * @property {string} type - Field type for deciding how to input data.
 * @property {string} [arrayItemPath] - Prefix for resolving path when
 *     looking up data for fields in an array item.
 * @property {string} [data] - Data to enter into the field input.
 * ---
 * @param {Element} element
 * @returns {Field}
 */
const createFieldObject = element => {
  const field = {
    element,
    key: element.prop('name') || element.prop('id'),
    type: element.prop('type') || element.prop('tagName'),
  };

  const isDateField = element
    .parent()
    .attr('class')
    ?.includes('date');

  if (isDateField) {
    // Dates in form data combine all the date components (year, month, day),
    // so treat filling out date fields as a single step for entering data.
    field.key = field.key.replace(/(Year|Month|Day)$/, '');
    field.type = 'date';
  }

  return field;
};

/**
 * Fills all of the fields on a page, looping until no more fields appear.
 */
Cypress.Commands.add('fillPage', () => {
  cy.location('pathname', NO_LOG_OPTION)
    .then(getArrayItemPath)
    .then(arrayItemPath => {
      const touchedFields = new Set();
      const snapshot = {};

      /**
       * Fills out a field (or set of fields) using the created field object,
       * if it's eligible, and exempts it from further processing.
       *
       * There are several reasons a field might not be eligible:
       * 1. No key was derived; the element has no name or id.
       * 2. The field was already processed individually or as part of a set.
       * 3. The element isn't part of the form schema.
       * 4. The element detached from the DOM, possibly due to re-rendering.
       *    It also may have changed as a result of interacting with another
       *    field. It will be processed in a later iteration.
       *
       * @param {Field}
       */
      const processFieldObject = field => {
        const shouldSkipField =
          !field.key ||
          field.element.prop('disabled') ||
          touchedFields.has(field.key) ||
          !field.key.startsWith('root_') ||
          Cypress.dom.isDetached(field.element);

        if (shouldSkipField) return;

        cy.findData({ ...field, arrayItemPath }).then(data => {
          if (typeof data !== 'undefined') cy.enterData({ ...field, data });
          touchedFields.add(field.key);
        });
      };

      const fillAvailableFields = () => {
        cy.get(APP_SELECTOR, NO_LOG_OPTION)
          .then($form => {
            // Get the starting number of array items and fields to compare
            // after filling out all currently visible fields, as new fields
            // may get added or expanded after this iteration.
            snapshot.arrayItemCount = $form.find(ARRAY_ITEM_SELECTOR).length;
            snapshot.fieldCount = $form.find(FIELD_SELECTOR).length;
          })
          .within(NO_LOG_OPTION, $form => {
            // Fill out every field that's currently on the page.
            const fields = $form.find(FIELD_SELECTOR);
            if (!fields.length) return;
            cy.wrap(fields).each(element => {
              cy.wrap(createFieldObject(element), NO_LOG_OPTION).then(
                processFieldObject,
              );
            });

            // Once all currently visible fields have been filled, add an array
            // item if there are more to be added according to the test data.
            if (snapshot.fieldCount === $form.find(FIELD_SELECTOR).length) {
              addNewArrayItem($form);
            }

            cy.wrap($form, NO_LOG_OPTION);
          })
          .then($form => {
            // If there are new array items or fields to be filled,
            // iterate through the page again.
            const { arrayItemCount, fieldCount } = snapshot;
            const fieldsNeedInput =
              arrayItemCount !== $form.find(ARRAY_ITEM_SELECTOR).length ||
              fieldCount !== $form.find(FIELD_SELECTOR).length;
            if (fieldsNeedInput) fillAvailableFields();
          });
      };

      fillAvailableFields();
    });

  Cypress.log();
});
