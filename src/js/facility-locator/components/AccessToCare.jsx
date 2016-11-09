import React, { Component } from 'react';
import { reduce, capitalize } from 'lodash';

export default class AccessToCare extends Component {
  renderDataRows() {
    const {
      attributes: { feedback }
    } = this.props.facility;

    // transform response from API
    const dataObject = reduce(feedback.health, (r, v, k) => {
      const returnObject = r;
      const lastKey = k.split('_').pop();
      const serviceName = k.split('_').slice(0, -1).join('_');

      if (!r[serviceName]) {
        returnObject[serviceName] = {};
      }

      returnObject[serviceName][lastKey] = v;

      return returnObject;
    }, {});

    return Object.keys(dataObject).map(k => {
      const name = k.split('_').reduce((s, e) => {
        return `${s} ${capitalize(e)}`;
      }, '');

      return (
        <tr key={k}>
          <th scope="row">{name}</th>
          <td>{Math.round(dataObject[k].urgent * 100)}%</td>
          <td>{Math.round(dataObject[k].routine * 100)}%</td>
        </tr>
      );
    });
  }


  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    return (
      <div>
        <table className="usa-table-borderless" style={{ margin: '2em 0 0.5em' }}>
          <thead>
            <tr>
              <th scope="col">Appointment Type</th>
              <th scope="col">Urgent</th>
              <th scope="col">Routine</th>
            </tr>
          </thead>
          <tbody>
            {this.renderDataRows()}
          </tbody>
        </table>
        <em>* % of Veterans who reported that they were "Always" or "Usually" able to get an appointment</em>
      </div>
    );
  }
}
