import React from 'react';
import { connect } from 'react-redux';

class HighTechEmploymentTypeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      computerProgramming: false,
      dataProcessing: false,
      computerSoftware: false,
      informationSciences: false,
      mediaApplication: false,
      noneApply: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.checked });
    if (e.target.id === 'noneApply') {
      this.setState({ computerProgramming: false });
      this.setState({ dataProcessing: false });
      this.setState({ computerSoftware: false });
      this.setState({ informationSciences: false });
      this.setState({ mediaApplication: false });
    } else {
      this.setState({ noneApply: false });
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
            checked={this.state.computerProgramming}
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
            checked={this.state.dataProcessing}
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
            checked={this.state.computerSoftware}
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
            checked={this.state.informationSciences}
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
            checked={this.state.mediaApplication}
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
            checked={this.state.noneApply}
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
