import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class HighTechEmploymentTypeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.formData,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNoneApply = this.handleNoneApply.bind(this);
    this.setHighTechEmploymentType = this.setHighTechEmploymentType.bind(this);
  }

  setHighTechEmploymentType(property, value) {
    _.set(this.props.formData, property, value);
  }

  handleChange(e) {
    this.handleNoneApply(e.target.id === 'noneApply');
    this.setHighTechEmploymentType([e.target.id], e.target.checked);
  }

  handleNoneApply(isNoneApply) {
    if (isNoneApply) {
      this.setHighTechEmploymentType('computerProgramming', false);
      this.setHighTechEmploymentType('dataProcessing', false);
      this.setHighTechEmploymentType('computerSoftware', false);
      this.setHighTechEmploymentType('informationSciences', false);
      this.setHighTechEmploymentType('mediaApplication', false);
    } else {
      this.setHighTechEmploymentType('noneApply', false);
    }
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

const mapStateToProps = state => ({
  computerProgramming: state.computerProgramming,
  dataProcessing: state.dataProcessing,
  computerSoftware: state.computerSoftware,
  informationSciences: state.informationSciences,
  mediaApplication: state.mediaApplication,
  noneApply: state.noneApply,
});

export default connect(mapStateToProps)(HighTechEmploymentTypeView);
