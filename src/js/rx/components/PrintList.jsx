import React from 'react';

class PrintList extends React.Component {
  handlePrintPastSixMonths() {
    return 'Printing past six months...';
  }

  handlePrintPastYear() {
    return 'Printing past year...';
  }

  handlePrintAll() {
    window.print();
  }

  render() {
    let content;

    if (this.props.type === 'history') {
      content = (
        <div>
          <span><i className="fa fa-print"></i>&nbsp; Print</span>
          <span className="rx-print-list-option">
            <a onClick={this.handlePrintPastSixMonths}>past 6 months</a>
          </span>
          <span className="rx-print-list-option">
            <a onClick={this.handlePrintPastYear}>past year</a>
          </span>
          <span className="rx-print-list-option">
            <a onClick={this.handlePrintAll}>all prescriptions</a>
          </span>
        </div>
      );
    } else {
      content = (<span><i className="fa fa-print"></i>&nbsp;
        <a onClick={this.handlePrintAll}>Print list</a></span>);
    }

    return (
      <div className="rx-print-list va-dnp">
        {content}
      </div>
    );
  }

}

PrintList.propTypes = {
  type: React.PropTypes.string
};

export default PrintList;
