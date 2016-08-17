/*
* Table row with a header as its first cell.
* headerText: string, required
* cellText: string, optional
* Child of Rx detail page.
*/
import React from 'react';

class TableRowVerticalHeader extends React.Component {
  render() {
    return (
      <tbody key={this.props.key}>
        <tr>
          <th>{this.props.headerText}</th>
          <td>{this.props.cellText}</td>
        </tr>
      </tbody>
    );
  }
}

TableRowVerticalHeader.propTypes = {
  headerText: React.PropTypes.string.isRequired,
  cellText: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
};

export default TableRowVerticalHeader;
