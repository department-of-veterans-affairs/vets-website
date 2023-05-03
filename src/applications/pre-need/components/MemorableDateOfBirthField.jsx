import React from 'react';
import { connect } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { setData } from 'platform/forms-system/src/js/actions';

class MemorableDateOfBirth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateVal: get('application.claimant.dateOfBirth', props.formData),
      errorVal: '',
    };
  }

  handleDateBlur = () => {
    const { dateVal } = this.state;
    const today = new Date();
    const dateInput = new Date(dateVal?.split('-').join(' '));

    if (dateInput > today) {
      this.setState({ errorVal: 'Please enter a valid current or past date' });
    } else {
      this.setState({ errorVal: '' });
    }
  };

  handleClick = event => {
    const content = event.target.value;
    const { formData, dispatch } = this.props;
    const updatedFormData = set(
      'application.claimant.dateOfBirth',
      content,
      { ...formData }, // make a copy of the original formData
    );
    this.setState({ dateVal: content });
    dispatch(setData(updatedFormData));
  };

  render() {
    const { dateVal, errorVal } = this.state;

    return (
      <>
        <VaMemorableDate
          label="Date of birth"
          required
          error={errorVal}
          value={dateVal}
          onDateBlur={() => this.handleDateBlur()}
          onDateChange={this.handleClick}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(MemorableDateOfBirth);
