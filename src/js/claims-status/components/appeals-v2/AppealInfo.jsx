import React from 'react';

const TABS = { status: 'Status', detail: 'Detail' };

class AppealInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: TABS.status };
  }

  render() {
    return (
      <div>
        <div>
          <ul className="va-tabs claim-appeal-tabs" role="tablist">
            <li className="appeal-status-tab" role="presentation">
              <button className="va-button-link status-tab-button" role="tab">
                Status
              </button>
            </li>
            <li className="appeal-detail-tab">
              <button className="va-button-link detail-tab-button" role="tab">
                Detail
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default AppealInfo;
