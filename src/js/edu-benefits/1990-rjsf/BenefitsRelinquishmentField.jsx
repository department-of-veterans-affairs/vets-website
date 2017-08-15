import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash/fp';

import ExpandingGroup from '../../common/components/form-elements/ExpandingGroup';


/**
 * Field for selecting the benefitsRelinquished and corresponding date as necessary.
 * @type {Object}
 */
export default class BenefitsRelinquishmentField extends React.Component {
  onPropertyChange(name) {
    return (value) => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : {
          benefitsRelinquished: undefined,
          benefitsRelinquishedDate: undefined
        };
      const newData = _.set(name, value, formData);
      this.props.onChange(newData);
      this.setState({ [name]: value });
    };
  }

  getNestedContent = (option) => {
    const SchemaField = this.props.registry.fields.SchemaField;
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      onBlur,
      registry
    } = this.props;
    const effectiveDateContent = (
      <div>
        <SchemaField
            name={'benefitsRelinquishedDate'}
            required
            schema={schema.properties.benefitsRelinquishedDate}
            uiSchema={uiSchema.benefitsRelinquishedDate}
            errorSchema={errorSchema.benefitsRelinquishedDate}
            idSchema={idSchema.benefitsRelinquishedDate}
            formData={formData.benefitsRelinquishedDate || moment().format('YYYY-MM-DD')}
            onChange={this.onPropertyChange('benefitsRelinquishedDate')}
            onBlur={onBlur}
            registry={registry}/>
        <ul>
          <li>Use today’s date unless you aren’t going to use your Post 9/11 GI Bill benefits until later.</li>
          <li>If you pick a future date, you can’t get benefits until then.</li>
          <li>If your classes started less than 2 years ago, enter the date they began.</li>
        </ul>
      </div>
    );

    const nestedContent = {
      chapter30: (
        <div>
          <div>
            <div className="usa-alert usa-alert-warning usa-content secondary">
              <div className="usa-alert-body">
                <span>If you choose to give up MGIB-AD, you’ll get benefits only for the number of months you had left under MGIB-AD.</span>
              </div>
            </div>
            <br/>
            {effectiveDateContent}
          </div>
        </div>
      ),
      chapter1606: effectiveDateContent,
      chapter1607: (
        <div>
          <div>
            <div className="usa-alert usa-alert-warning usa-content secondary">
              <div className="usa-alert-body">
                <span>You can only give up REAP benefits if you had them for the last semester, quarter, or term that ended on or before November 24, 2015.</span>
              </div>
            </div>
            <br/>
            {effectiveDateContent}
          </div>
        </div>
      )
    };

    return nestedContent[option];
  }

  render() {
    const { schema, uiSchema, formData } = this.props;
    const id = this.props.idSchema.$id;
    return (
      <div>{
        schema.properties.benefitsRelinquished.enum.map((option, i) => {
          const checked = option === formData.benefitsRelinquished;
          const radioButton = (
            <div className="form-radio-buttons" key={option}>
              <input type="radio"
                  autoComplete="false"
                  checked={checked}
                  id={`${id}_${i}`}
                  name={`${id}_${i}`}
                  value={option}
                  onChange={__ => this.onPropertyChange('benefitsRelinquished')(option)}/>
              <label htmlFor={`${id}_${i}`}>
                {uiSchema['ui:options'].labels[option]}
              </label>
            </div>
          );

          const nestedContent = this.getNestedContent(option);
          if (!!nestedContent) {
            return (
              <ExpandingGroup open={checked} key={option}>
                {radioButton}
                <div className="schemaform-radio-indent">
                  {nestedContent}
                </div>
              </ExpandingGroup>
            );
          }

          return radioButton;
        })
      }</div>
    );
  }
}

BenefitsRelinquishmentField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.object,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  })
};
