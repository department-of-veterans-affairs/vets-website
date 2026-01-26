import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { scrollToError } from './helpers';

import propTypes from './types';

import { makeNamePossessive } from '../../../shared/utils';

// Regex patterns for address validation copied from schema
const usZipRegex = /^\d{5}$/;
const postalRegex = /^.*\S.*/;

const initialAddressUI = addressUI();
initialAddressUI.street['ui:errorMessages'].minLength =
  'Enter a valid street address';

const isValidPostalCode = (code, outsideUs) =>
  outsideUs ? postalRegex.test(code || '') : usZipRegex.test(code || '');

const stepchildCurrentAddress = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: () => 'stepchild-lives-with',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.endStreet ||
        !itemData.endCity ||
        !isValidPostalCode(itemData.endPostalCode, itemData.endOutsideUs) ||
        (!itemData.endOutsideUs && !itemData.endState) ||
        (itemData.endOutsideUs && !itemData.endCountry)
      ) {
        scrollToError();
      } else {
        goForward();
      }
    },
  },

  /**
   * @type {PicklistComponentProps}
   * @returns {React.ReactElement} Page component
   */
  Component: ({ itemData, firstName, handlers, formSubmitted, isEditing }) => {
    const [localData, setLocalData] = useState({
      city: itemData.endCity || '',
      country: itemData.endCountry || '',
      isMilitary: ['APO', 'FPO', 'DPO'].includes(itemData.endCity),
      endOutsideUs: itemData.endCountry !== 'USA',
      postalCode: itemData.endPostalCode || '',
      state: itemData.endState || '',
      street: itemData.endStreet || '',
      street2: itemData.endStreet2 || '',
      street3: itemData.endStreet3 || '',
    });
    const [schema, setSchema] = useState(addressSchema());
    const [uiSchema, setUiSchema] = useState(initialAddressUI);

    const onChange = data => {
      // updateSchemasAndData is needed to ensure the schema callback functions
      // are executed to update the schema based on form data
      const result = updateSchemasAndData(
        cloneDeep(schema),
        cloneDeep(uiSchema),
        cloneDeep(data),
        false, // preserveHiddenData default
        cloneDeep(data),
      );
      setLocalData(result.data);
      setSchema(result.schema);
      setUiSchema(result.uiSchema);

      // Transform local data to formData structure
      handlers.onChange({
        ...itemData,
        endIsMilitary: result.data.isMilitary,
        endCountry: result.data.country,
        endOutsideUs: result.data.country !== 'USA',
        endCity: (result.data.city || '').trim(),
        endState: (result.data.state || '').trim(),
        endStreet: (result.data.street || '').trim(),
        endStreet2: (result.data.street2 || '').trim(),
        endStreet3: (result.data.street3 || '').trim(),
        endPostalCode: (result.data.postalCode || '').trim(),
      });
    };

    useEffect(() => {
      // Initialize form data, schema and uiSchema
      onChange(localData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <h3 className="vads-u-margin-bottom--4">
          {isEditing ? 'Editing ' : ''}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {makeNamePossessive(firstName)}
          </span>{' '}
          current address
        </h3>
        <SchemaForm
          name="address"
          title="Address"
          addNameAttribute
          schema={schema}
          data={localData}
          uiSchema={uiSchema}
          onChange={onChange}
          onSubmit={handlers.onSubmit}
          formContext={{ submitted: formSubmitted }}
        >
          <div />
        </SchemaForm>
      </>
    );
  },
};

stepchildCurrentAddress.propTypes = propTypes.Page;
stepchildCurrentAddress.Component.propTypes = propTypes.Component;

export default stepchildCurrentAddress;
