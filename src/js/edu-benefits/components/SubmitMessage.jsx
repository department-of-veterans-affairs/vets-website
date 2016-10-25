import React from 'react';
import moment from 'moment';
import ExpandingGroup from '../../common/components/form-elements/ExpandingGroup';

export default class SubmitMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }
  makeList(arr) {
    if (arr && arr.length) {
      return (
        <ul className="claim-list">
        {
          arr.map((d, i) => {
            return (<li key={i}>{d}</li>);
          })
        }
        </ul>
      );
    }
    return null;
  }
  render() {
    const name = this.props.name;
    let relinquished = null;

    if (this.props.chapter33) {
      relinquished = (<div className="claim-relinquished">
        <span><i>Relinquished:</i></span>
        {this.makeList([this.props.relinquishedBenefits])}
      </div>);
    }
    return (
      <div className="edu-benefits-submit-success">
        <h3>Claim received</h3>
        <p>Normally processed within <b>30 days</b></p>
        <p>
          VA may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Education Benefit Claim <span className="additional">(Form 22-1990)</span></h4>
          <span>for {name.first.value} {name.middle.value} {name.last.value} {name.suffix.value}</span>

          <ul className="claim-list">
            <li>
              <b>Benefit claimed</b><br/>
              {this.makeList(this.props.claimedBenefits)}
              {relinquished}
            </li>
            <li>
              <b>Confirmation number</b><br/>
              <span>{this.props.confirmation}</span>
            </li>
            <li>
              <b>Date receieved</b><br/>
              <span>{moment(this.props.date).format('MMM D, YYYY')}</span>
            </li>
            <li>
              <b>Your claim was sent to</b><br/>
              <address className="edu-benefits-pre">{this.props.address}</address>
            </li>
          </ul>
        </div>
        <div className="inset secondary expandable">
          <ExpandingGroup open={this.state.isExpanded} showPlus>
            <div onClick={this.handleClick} className="clickable">
              <b>No documents required at this time</b>
            </div>
            <div>
              <p>In the future, you might need:</p>
              <ul>
                <li>Your reserve kicker</li>
                <li>Documentation of additional contributions that would increase your monthly benefits.</li>
              </ul>
              <p>Documents can be uploaded using the <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">GI Bill site</a>.</p>
            </div>
          </ExpandingGroup>
        </div>
        <p>Need help? If you have questions, call 1-888-442-4551 (1-888-GI-Bill)</p>
      </div>
    );
  }
}

SubmitMessage.propTypes = {
  name: React.PropTypes.object,
  claimedBenefits: React.PropTypes.array,
  relinquishedBenefits: React.PropTypes.string,
  claimType: React.PropTypes.string,
  confirmation: React.PropTypes.string,
  date: React.PropTypes.string,
  address: React.PropTypes.string
};
