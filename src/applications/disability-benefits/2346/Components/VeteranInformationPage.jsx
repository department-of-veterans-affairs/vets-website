import React from 'react';
import { connect } from 'react-redux';
import { getVeteranInformationData } from '../actions';

class VeteranInformationPage extends React.Component {
  componentDidMount() {
    this.props.getVeteranInformationData();
  }
  render() {
    const { first, last, gender, dateOfBirth } = this.props;
    return (
      <div>
        <p>This is the personal information we have for you.</p>
        <div>
          <div className="usa-alert schemaform-sip-alert">
            <div className="usa-alert-body">
              {first} {last} <br />
              Date of Birth: {dateOfBirth} <br />
              Gender: {gender}
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  first: state.form2346Reducer?.formData?.veteranFullName?.first || '',
  last: state.form2346Reducer?.formData?.veteranFullName?.last || '',
  gender: state.form2346Reducer?.formData?.gender || '',
  dateOfBirth: state.form2346Reducer?.formData?.dateOfBirth || '',
});
const mapDispatchToProps = {
  getVeteranInformationData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranInformationPage);
