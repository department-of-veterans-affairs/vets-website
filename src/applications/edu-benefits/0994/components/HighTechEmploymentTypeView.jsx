import React from 'react';
import _ from 'lodash';
import { TargetCheckboxWidget } from './TargetCheckboxWidget';

const highTechEmploymentTypeIds = {
  computerProgramming: 'computerProgramming',
  dataProcessing: 'dataProcessing',
  computerSoftware: 'computerSoftware',
  informationSciences: 'informationSciences',
  mediaApplication: 'mediaApplication',
  noneApply: 'noneApply',
};

const setHighTechEmploymentType = (formData, property, value) => {
  _.set(formData, property, value);
};

const isNoneApply = id => id === highTechEmploymentTypeIds.noneApply;

const handleNoneApply = (id, formData) => {
  if (isNoneApply(id)) {
    setHighTechEmploymentType(formData, 'computerProgramming', false);
    setHighTechEmploymentType(formData, 'dataProcessing', false);
    setHighTechEmploymentType(formData, 'computerSoftware', false);
    setHighTechEmploymentType(formData, 'informationSciences', false);
    setHighTechEmploymentType(formData, 'mediaApplication', false);
  } else {
    setHighTechEmploymentType(formData, 'noneApply', false);
  }
};

const updateFormData = props => {
  props.onChange(props.formData);
};

class HighTechEmploymentTypeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.formData,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { id, checked } = e;
    handleNoneApply(id, this.props.formData);
    setHighTechEmploymentType(this.props.formData, [id], checked);
    updateFormData(this.props);
    this.setState(this.props.formData);
  }

  render() {
    return (
      <div>
        <legend className="schemaform-label">
          Which area best describes your high-tech work experience? (Check all
          that apply.)
        </legend>
        <fieldset className="schemaform-field-template">
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.computerProgramming}
            value={this.props.formData.computerProgramming}
            onChange={this.handleChange}
            options={{ title: 'Computer programming' }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.dataProcessing}
            value={this.props.formData.dataProcessing}
            onChange={this.handleChange}
            options={{ title: 'Data processing' }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.computerSoftware}
            value={this.props.formData.computerSoftware}
            onChange={this.handleChange}
            options={{ title: 'Computer software' }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.informationSciences}
            value={this.props.formData.informationSciences}
            onChange={this.handleChange}
            options={{ title: 'Information sciences' }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.mediaApplication}
            value={this.props.formData.mediaApplication}
            onChange={this.handleChange}
            options={{ title: 'Media application' }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.noneApply}
            value={this.props.formData.noneApply}
            onChange={this.handleChange}
            options={{ title: 'None of these' }}
          />
        </fieldset>
      </div>
    );
  }
}

export default HighTechEmploymentTypeView;
