import React from 'react';
import { connect } from 'react-redux';

import {
  toggleFolderNav
} from '../actions';

import TabItem from '../components/TabItem';

export class Settings extends React.Component {
  render() {
    return (
      <div>
        <div id="messaging-content-header">
          <button
              className="messaging-menu-button"
              type="button"
              onClick={this.props.toggleFolderNav}>
            Menu
          </button>
          <h2>Settings</h2>
        </div>
        <div id="messaging-settings">
          <ul className="va-tabs" role="tablist">
            <TabItem shortcut={1} tabpath="settings/folders" title="Manage folders"/>
            <TabItem shortcut={2} tabpath="settings/notifications" title="Email notifications"/>
          </ul>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  toggleFolderNav
};

export default connect(null, mapDispatchToProps)(Settings);
