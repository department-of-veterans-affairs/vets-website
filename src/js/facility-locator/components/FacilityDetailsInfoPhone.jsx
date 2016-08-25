import React, { Component, PropTypes } from 'react';

class FacilityDetailsInfoPhone extends Component {
  appendPhone(numbers) {
    let str = numbers.map((number) => { return `${number}<br />` }).join('');

    return { __html: str }
  }

  render () {
    return (
      <div>
        <h5 style={{ marginTop: '15px' }}>Phone:</h5>
        <table style={{marginTop: '-10px', border: 'none' }} cellPadding="0" cellSpacing="0">
          <tr>
            <td>Main Number:</td>
            <td dangerouslySetInnerHTML={this.appendPhone(this.props.main)} />
          </tr>
          <tr>
            <td>Fax:</td>
            <td dangerouslySetInnerHTML={this.appendPhone(this.props.fax)} />
          </tr>
        </table>
      </div>
    );
  }
}

FacilityDetailsInfoPhone.propTypes = {
  main: PropTypes.arrayOf(PropTypes.string).isRequired,
  fax: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FacilityDetailsInfoPhone;

