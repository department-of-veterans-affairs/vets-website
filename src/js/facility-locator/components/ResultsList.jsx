import React, { Component, PropTypes } from 'react';
import { compact } from 'lodash';
import { Link } from 'react-router';


class ResultsList extends Component {
  render() {
    const { facilities } = this.props;

    return (
      <ol>
        {
          facilities.map(f => {
            const { address, phone, name } = f.attributes;
            const addressString = [
              compact([address.building, address.street, address.suite]).join(' '),
              `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
            ];

            return (
              <li key={f.id} className="facility-result">
                <Link to={`facilities/facility/${f.id}`}>
                  <h5>{name}</h5>
                </Link>
                <strong>Facility type: {f.type}</strong>
                <p>
                  {addressString[0]}<br/>
                  {addressString[1]}
                </p>
                <span style={{ marginRight: '1rem' }}>
                  <a href={`tel:${phone.main}`}>
                    <i className="fa fa-phone"/> {phone.main}
                  </a>
                </span>
                <span>
                  <a href={`https://maps.google.com?saddr=Current+Location&daddr=${addressString.join(' ')}`} target="_blank">
                    <i className="fa fa-map"/> Directions
                  </a>
                </span>
              </li>
            );
          })
        }
      </ol>
    );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
};

export default ResultsList;
