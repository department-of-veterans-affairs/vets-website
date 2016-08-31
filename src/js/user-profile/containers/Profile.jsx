import React from 'react';
import faker from 'faker';
import { connect } from 'react-redux';

// Generate fake data.  TODO: Retrieve this from the actual API
const randomIDNumber = faker.random.number();

class Profile extends React.Component {
  render() {
    return (
      <div className="va-tab-content">
        <h1>{this.props.profile.email}: Profile</h1>
        <table className="usa-table-borderless">
          <tbody>
            <tr>
              <th scope="row">Name: </th>
              <td>{this.props.profile.email}</td>
            </tr>
            <tr>
              <th scope="row">Email: </th>
              <td>{this.props.profile.email}</td>
            </tr>
            <tr>
              <th scope="row">ID Number: </th>
              <td>{randomIDNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return {
    profile: state.profile
  };
};

export default connect(mapStateToProps)(Profile);
