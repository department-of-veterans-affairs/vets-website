/*
Table with rows that have a header as the first cell.
Used on Rx detail page.
*/
import React from 'react';
import _ from 'lodash';

import TableRowVerticalHeader from './TableRowVerticalHeader';

class TableVerticalHeader extends React.Component {
  render() {
    const makeRows = (inputData) => {
      const rows = [];

      _.forEach(inputData, (value, key) => {
        rows.push(<TableRowVerticalHeader
            cellText={value}
            headerText={key}/>);
      });

      return rows;
    };

    // Adds an iterator key property
    let rowKey = 1;
    return (
      <table className={this.props.cssClass} key={rowKey++}>
        {makeRows(this.props.data)}
      </table>
    );
  }
}

TableVerticalHeader.propTypes = {
  data: React.PropTypes.object.isRequired,
  cssClass: React.PropTypes.string
};

export default TableVerticalHeader;
