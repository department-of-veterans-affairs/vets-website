import React from 'react';
import classNames from 'classnames';

export default class AdditionalSourcesField extends React.Component {
  constructor() {
    super();
    this.state = { adding: false };
  }

  render() {
    const {
      schema,
      uiSchema,
      idSchema,
      data,
      registry
    } = this.props;
    const SchemaField = this.props.registry.fields.SchemaField;

    return (
      <div>
        {!this.state.adding && <button
            type="button"
            className={classNames(
              'usa-button-outline',
              'va-growable-add-btn'
            )}
            onClick={this.handleAdd}>
          Add Another Source
        </button>}
      </div>
    );
  }
}
