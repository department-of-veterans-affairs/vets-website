import React from 'react';

class NeedFilesFromYou extends React.Component {
  render() {
    const filesNeeded = this.props.events.filter(event => event.type === 'still_need_from_you_list').length;
    return (
      <div className="usa-alert usa-alert-warning claims-alert">
        <div className="usa-alert-body">
          <h4 className="usa-alert-heading">{filesNeeded} {filesNeeded === 1 ? 'item needs' : 'items need'} your attention</h4>
          <button className="va-button-secondary">View Details</button>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

NeedFilesFromYou.propTypes = {
  events: React.PropTypes.array.isRequired
};

export default NeedFilesFromYou;
