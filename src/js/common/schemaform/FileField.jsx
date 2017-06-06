import PropTypes from 'prop-types';
import React from 'react';
// import _ from 'lodash/fp';
// import Scroll from 'react-scroll';

export default class FileField extends React.Component {
  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      registry,
      formContext,
      schema
    } = this.props;
    const FieldTemplate = registry.FieldTemplate;
    let items;
    if (schema.type === 'array') {
      items = formData || [];
    } else {
      items = formData ? [formData] : [];
    }

    return (
      <FieldTemplate>
        <div>
          {items.map((item, index) => {
            return (
              <div key={index}>
              </div>
            );
          })}
          <label
              role="button"
              tabIndex="0"
              htmlFor={idSchema.$id}
              className="usa-button usa-button-outline">
            Add file
          </label>
          <input type="file"
              style={{ display: 'none' }}
              id={idSchema.$id}
              name={idSchema.$id}
              onChange={this.uploadFile}/>
        </div>
      </FieldTemplate>
    );
  }
}

FileField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
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
