/* Creates segments of grouped prescriptions with a title
 * and a list of prescription cards.
 *
 * Properties:
 * - `title`: String containing the section heading for this group.
 * - `items`: Array of items.
*/

import React from 'react';

class PrescriptionGroup extends React.Component {
  render() {
    return (
      <section className="rx-prescription-group cf">
        <h3 className="va-h-ruled">{this.props.title}</h3>
        <div>{this.props.items}</div>
      </section>
    );
  }
}

PrescriptionGroup.propTypes = {
  title: React.PropTypes.string.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    attributes: React.PropTypes.object,
    id: React.PropTypes.string,
    type: React.PropTypes.func,
    links: React.PropTypes.object
  })).isRequired
};

export default PrescriptionGroup;
