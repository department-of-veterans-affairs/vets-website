import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';

export default class EducationPeriod extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const certificate = this.props.data;
    const formFields = (
      <div className="input-section">
        <ErrorableTextInput
            label="Name"
            name="name"
            field={certificate.name}
            onValueChange={(update) => {onValueChange('name', update);}}/>
      </div>
    );

    return view === 'collapsed' ? (<div>{certificate.name.value}</div>) : formFields;
  }
}

EducationPeriod.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};
