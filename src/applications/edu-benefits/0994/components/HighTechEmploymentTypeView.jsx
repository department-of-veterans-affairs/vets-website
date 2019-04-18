import React from 'react';
import _ from 'lodash';
import { TargetCheckboxWidget } from './TargetCheckboxWidget';

const highTechEmploymentTypeIds = {
  computerProgramming: {
    value: 'computerProgramming',
    title: 'Computer programming',
  },
  dataProcessing: {
    value: 'dataProcessing',
    title: 'Data processing',
  },
  computerSoftware: {
    value: 'computerSoftware',
    title: 'Computer software',
  },
  informationSciences: {
    value: 'informationSciences',
    title: 'Information sciences',
  },
  mediaApplication: {
    value: 'mediaApplication',
    title: 'Media application',
  },
  noneApply: {
    value: 'noneApply',
    title: 'None of these',
  },
};

const setHighTechEmploymentType = (formData, property, value) => {
  _.set(formData, property, value);
};

const isNoneApply = id => id === highTechEmploymentTypeIds.noneApply.value;

const handleNoneApply = (id, formData) => {
  if (isNoneApply(id)) {
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.computerProgramming.value,
      false,
    );
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.dataProcessing.value,
      false,
    );
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.computerSoftware.value,
      false,
    );
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.informationSciences.value,
      false,
    );
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.mediaApplication.value,
      false,
    );
  } else {
    setHighTechEmploymentType(
      formData,
      highTechEmploymentTypeIds.noneApply.value,
      false,
    );
  }
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
    const formData = { ...this.props.formData };
    handleNoneApply(id, formData);
    setHighTechEmploymentType(formData, [id], checked);
    this.props.onChange(formData);
    this.setState(formData);
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
            id={highTechEmploymentTypeIds.computerProgramming.value}
            value={this.props.formData.computerProgramming}
            onChange={this.handleChange}
            options={{
              title: highTechEmploymentTypeIds.computerProgramming.title,
            }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.dataProcessing.value}
            value={this.props.formData.dataProcessing}
            onChange={this.handleChange}
            options={{ title: highTechEmploymentTypeIds.dataProcessing.title }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.computerSoftware.value}
            value={this.props.formData.computerSoftware}
            onChange={this.handleChange}
            options={{
              title: highTechEmploymentTypeIds.computerSoftware.title,
            }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.informationSciences.value}
            value={this.props.formData.informationSciences}
            onChange={this.handleChange}
            options={{
              title: highTechEmploymentTypeIds.informationSciences.title,
            }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.mediaApplication.value}
            value={this.props.formData.mediaApplication}
            onChange={this.handleChange}
            options={{
              title: highTechEmploymentTypeIds.mediaApplication.title,
            }}
          />
          <TargetCheckboxWidget
            id={highTechEmploymentTypeIds.noneApply.value}
            value={this.props.formData.noneApply}
            onChange={this.handleChange}
            options={{ title: highTechEmploymentTypeIds.noneApply.title }}
          />
        </fieldset>
      </div>
    );
  }
}

export default HighTechEmploymentTypeView;
