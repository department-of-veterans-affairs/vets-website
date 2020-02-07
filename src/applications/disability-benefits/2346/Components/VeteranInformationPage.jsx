import React from 'react';
import { connect } from 'react-redux';
import { getVeteranInformation } from '../api';

class VeteranInformationPage extends React.Component {
  componentDidMount() {
    getVeteranInformation().then(data => {
      if (data.error) {
        // eslint-disable-next-line no-console
        console.log(data.error);
      } else {
        // eslint-disable-next-line no-console
        console.log(data);
        // eslint-disable-next-line no-console
        console.log(data.formData.veteranFullName);
      }
    });
    // eslint-disable-next-line no-console
    console.log(this.props);
  }
  render() {
    const { formData } = this.props;
    return (
      <div>
        <p>This is the personal information we have for you.</p>
        <div>
          <div className="usa-alert schemaform-sip-alert">
            <div className="usa-alert-body">
              You can save this form in progress, and come back later to finish
              filling it out.
              {formData}
            </div>
          </div>
          <br />
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  formData: store.formData,
});

// export default VeteranInformationPage;

export default connect(mapStateToProps)(VeteranInformationPage);
