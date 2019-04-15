import React from 'react';
import _ from 'lodash';

const setHighTechEmploymentType = (formData, property, value) => {
  _.set(formData, property, value);
};

const handleNoneApply = (isNoneApply, formData) => {
  if (isNoneApply) {
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
    handleNoneApply(e.target.id === 'noneApply', this.props.formData);
    setHighTechEmploymentType(
      this.props.formData,
      [e.target.id],
      e.target.checked,
    );
    updateFormData(this.props);
    this.forceUpdate();
  }

  render() {
    const highTechEmploymentTypeIds = {
      computerProgramming: 'computerProgramming',
      dataProcessing: 'dataProcessing',
      computerSoftware: 'computerSoftware',
      informationSciences: 'informationSciences',
      mediaApplication: 'mediaApplication',
      noneApply: 'noneApply',
    };

    return (
      <fieldset className="schemaform-field-template">
        <div>
          <legend className="schemaform-label">
            Which area best describes your high-tech work experience? (Check all
            that apply.)
          </legend>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.computerProgramming}
            name={highTechEmploymentTypeIds.computerProgramming}
            checked={this.props.formData.computerProgramming}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.computerProgramming}
          >
            Computer programming
          </label>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.dataProcessing}
            name={highTechEmploymentTypeIds.dataProcessing}
            checked={this.props.formData.dataProcessing}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.dataProcessing}
          >
            Data processing
          </label>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.computerSoftware}
            name={highTechEmploymentTypeIds.computerSoftware}
            checked={this.props.formData.computerSoftware}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.computerSoftware}
          >
            Computer software
          </label>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.informationSciences}
            name={highTechEmploymentTypeIds.informationSciences}
            checked={this.props.formData.informationSciences}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.informationSciences}
          >
            Information sciences
          </label>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.mediaApplication}
            name={highTechEmploymentTypeIds.mediaApplication}
            checked={this.props.formData.mediaApplication}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.mediaApplication}
          >
            Media application
          </label>
          <input
            type="checkbox"
            id={highTechEmploymentTypeIds.noneApply}
            name={highTechEmploymentTypeIds.noneApply}
            checked={this.props.formData.noneApply}
            onChange={this.handleChange}
          />
          <label
            className="schemaform-label"
            htmlFor={highTechEmploymentTypeIds.noneApply}
          >
            None of these
          </label>
        </div>
      </fieldset>
    );
  }
}

export default HighTechEmploymentTypeView;
