import React from 'react';
import { connect } from 'react-redux';

import Address from '../Address';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class VeteranAddressSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Street:</td>
            <td>{this.props.data.veteranAddress.street.value}</td>
          </tr>
          <tr>
            <td>Line 2:</td>
            <td>{this.props.data.veteranAddress.street2.value}</td>
          </tr>
          <tr>
            <td>Line 3:</td>
            <td>{this.props.data.veteranAddress.street3.value}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{this.props.data.veteranAddress.city.value}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{this.props.data.veteranAddress.country.value}</td>
          </tr>
          <tr>
            <td>State/Province:</td>
            <td>{this.props.data.veteranAddress.state.value || this.props.data.veteranAddress.provinceCode.value}</td>
          </tr>
          <tr>
            <td>ZIP/Postal Code:</td>
            <td>{this.props.data.veteranAddress.zipcode.value || this.props.data.veteranAddress.postalCode.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <h5>Permanent Address</h5>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <Address required
              value={this.props.data.veteranAddress}
              onUserInput={(update) => {this.props.onStateChange('veteranAddress', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/veteran-information/veteran-address'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(VeteranAddressSection);
export { VeteranAddressSection };
