import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp';

import {
  orderProperties,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { focusElement } from '../../../../platform/utilities/ui';
import {
  militaryStateCodes,
  militaryPostOfficeTypeCodes,
  ADDRESS_TYPES
} from '../../../../platform/forms/address';

const { domestic, international, military } = ADDRESS_TYPES;

import { pureWithDeepEquals } from '../../../common/schemaform/helpers';
import { getAddressCountries, getAddressStates } from '../actions';

/**
 * Input component for a PCIU address.
 *
 * Additional validation can be specified via ui:validations.
 */

class PCIUAddressField extends React.Component {

  constructor(props) {
    super(props);
    this.SchemaField = pureWithDeepEquals(this.props.registry.fields.SchemaField);
    this.orderedProperties = this.orderAndFilterProperties(props.schema, props.uiSchema);
  }

  componentDidMount() {
    if (!this.props.statesAvailable) {
      this.props.getAddressStates();
    }
    if (!this.props.countriesAvailable) {
      this.props.getAddressCountries();
    }
    focusElement('h5');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.schema !== nextProps.schema || this.props.uiSchema !== nextProps.uiSchema) {
      this.orderedProperties = this.orderAndFilterProperties(nextProps.schema, nextProps.uiSchema);
    }
  }

  componentDidUpdate() {
    // conditionally set required fields based on whether a type has been set
    const { type } = this.props.formData;
    if (type === 'DOMESTIC') {
      this.props.schema.required = ['country', 'addressLine1', 'city', 'state', 'zipCode'];
    } else if (type === 'MILITARY') {
      this.props.schema.required = ['addressLine1', 'militaryStateCode', 'militaryPostOfficeTypeCode'];
    } else {
      this.props.schema.required = ['country', 'addressLine1', 'city'];
    }
  }


  setValue = (value, title) => {
    this.props.onChange(_.set(title, value, this.props.formData));
  };

  setType = (value, title) => {
    let newData = _.set(title, value, this.props.formData);
    if (militaryPostOfficeTypeCodes.includes(_.uppercase(value)) || militaryStateCodes.includes(value)) {
      newData = _.set('type', military, newData);
      newData = this.unsetNonMilitaryValues(newData);
    } else if ((title === 'country' && value === 'USA') || title === 'state') {
      newData = _.set('type', domestic, newData);
      newData = this.unsetMilitaryValues(newData);
    } else if (title === 'country' && value !== 'USA') {
      newData = _.set('type', international, newData);
      newData = this.unsetMilitaryValues(newData);
    } else if ((title === 'city' || title === 'militaryPostOfficeTypeCode') &&
      !militaryPostOfficeTypeCodes.includes(_.uppercase(value))) {
      newData = _.set('type', international, newData);
      newData = this.unsetMilitaryValues(newData);
    }
    this.props.onChange(newData);
  };

  // This runs a series of steps that order properties and then group them into
  // expandable groups. If there are no expandable groups, then the end result of this
  // will be an array of single item arrays
  orderAndFilterProperties = (schema, uiSchema) => {
    const properties = Object.keys(schema.properties).filter(item => item !== 'type');
    const orderedProperties = orderProperties(properties, _.get('ui:order', uiSchema));
    const filteredProperties = orderedProperties.filter(prop => !schema.properties[prop]['ui:hidden']);
    const groupedProperties = _.groupBy((item) => {
      const expandUnderField = _.get([item, 'ui:options', 'expandUnder'], uiSchema);
      return expandUnderField || item;
    }, filteredProperties);

    return _.values(groupedProperties);
  }

  handleChange = (value, title) => {
    if (!value) {
      return this.props.onChange(_.unset(title, this.props.formData));
    }
    // Set military city
    if (title === 'city' && militaryPostOfficeTypeCodes.includes(_.uppercase(value))) {
      return this.setType(value, 'militaryPostOfficeTypeCode');
      // Reset city
    } else if (title === 'militaryPostOfficeTypeCode' && !militaryPostOfficeTypeCodes.includes(_.uppercase(value))) {
      return this.setType(value, 'city');
      // Set military state
    } else if (title === 'militaryStateCode' || (title === 'state' && militaryStateCodes.includes(value))) {
      return this.setType(value, 'militaryStateCode');
      // Reset state
    } else if (title === 'state' && !militaryStateCodes.includes(value)) {
      return this.setType(value, title);
    }
    // Set all others
    return this.setType(value, title);
  };

  unsetNonMilitaryValues = formData => {
    let newData = _.unset('city', formData);
    newData = _.unset('state', newData);
    newData = _.unset('country', newData);
    newData = _.unset('zipCode', newData);
    return newData;
  };

  unsetMilitaryValues = formData => {
    let newData = _.unset('militaryStateCode', formData);
    newData = _.unset('militaryPostOfficeTypeCode', newData);
    return newData;
  };

  isRequired = (name) => {
    const { schema } = this.props;
    const schemaRequired = Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  }

  render() {
    const {
      formData,
      errorSchema,
      schema,
      uiSchema,
      idSchema,
      onBlur,
      disabled,
      readonly
    } = this.props;
    const SchemaField = this.SchemaField;

    const renderProp = propName => {
      return (
        <div key={propName}>
          <SchemaField
            name={propName}
            required={this.isRequired(propName)}
            schema={schema.properties[propName]}
            uiSchema={uiSchema[propName]}
            errorSchema={errorSchema[propName]}
            idSchema={idSchema[propName]}
            formData={formData[propName]}
            onChange={value => this.handleChange(value, propName)}
            onBlur={onBlur}
            registry={this.props.registry}
            disabled={disabled}
            readonly={readonly}/>
        </div>
      );
    };
    return (
      <div>{this.orderedProperties.map(prop => renderProp(prop[0]))}</div>
    );
  }
}

function mapStateToProps(state) {
  const { countries, countriesAvailable, states, statesAvailable } = state.pciu;

  return {
    countries,
    countriesAvailable,
    states,
    statesAvailable
  };
}

const mapDispatchToProps = {
  getAddressCountries,
  getAddressStates
};

PCIUAddressField.propTypes = {
  countries: PropTypes.array.isRequired,
  countriesAvailable: PropTypes.bool.isRequired,
  states: PropTypes.array.isRequired,
  statesAvailable: PropTypes.bool.isRequired,
  getAddressCountries: PropTypes.func.isRequired,
  getAddressStates: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.object,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(PCIUAddressField);

export { PCIUAddressField };
