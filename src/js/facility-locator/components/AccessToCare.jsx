import React, { Component } from 'react';
import { reduce, capitalize, values, every } from 'lodash';

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

      if (dataObject[k].urgent && dataObject[k].routine) {
        return (
          <tr key={k}>
            <th scope="row">{name}</th>
            <td>{Math.round(dataObject[k].urgent * 100)}%</td>
            <td>{Math.round(dataObject[k].routine * 100)}%</td>
          </tr>
        );
      }

      return null;
    });
  }


  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    // hide entire section of all values are null
    if (every(values(facility.attributes.feedback.health), e => !e)) {
      return null;
    }

    const {
      health: {
        effective_date_range: effectiveDateRange
      }
    } = facility.attributes.feedback;

    return (
      <div className="mb2">
        <h4 className="highlight">Satisfaction Score</h4>
        {effectiveDateRange ? (<p>Current as of <strong>{effectiveDateRange}</strong></p>) : null}
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
          <span>Note: % of Veterans who reported that they were "Always" or "Usually" able to get an appointment</span>
        </div>
      </div>
    );
  }
}
