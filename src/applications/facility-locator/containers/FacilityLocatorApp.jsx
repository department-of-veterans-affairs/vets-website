import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import appendQuery from 'append-query';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { validateIdString } from '../utils/helpers';

class FacilityLocatorApp extends React.Component {
  componentDidMount() {
    const modal = document.querySelector('#my-modal');
    modal.addEventListener('closeEvent', () => {
      modal.visible = false;
    });
  }

  renderBreadcrumbs(location, selectedResult) {
    // Map and name props for the search query object
    const {
      currentPage: page,
      context,
      facilityType,
      searchString: address,
      serviceType,
      zoomLevel,
    } = this.props.searchQuery;

    // Build the query object in the expected order
    const searchQueryObj = {
      zoomLevel,
      page,
      address,
      location: `${location.latitude},${location.longitude}`,
      context,
      facilityType,
      serviceType,
    };

    const crumbs = [
      <a href="/" key="home">
        Home
      </a>,
      <Link to={appendQuery('/', searchQueryObj)} key="facility-locator">
        Find Locations
      </Link>,
    ];

    if (validateIdString(location.pathname, '/facility') && selectedResult) {
      crumbs.push(
        <li>
          <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
            {selectedResult.attributes?.name}
          </Link>
        </li>,
      );
    } else if (
      validateIdString(location.pathname, '/provider') &&
      selectedResult
    ) {
      crumbs.push(
        <li>
          <Link to={`/${selectedResult.id}`} key={selectedResult.id}>
            Provider Details
          </Link>
        </li>,
      );
    }

    return crumbs;
  }

  render() {
    const { location, selectedResult } = this.props;

    const handleModalOpen = () => {
      document.querySelector('#my-modal').visible = true;
    };

    return (
      <div>
        <va-breadcrumbs>
          {this.renderBreadcrumbs(location, selectedResult)}
        </va-breadcrumbs>
        <div className="row">
          <h3>va-notification</h3>

          <va-notification
            closeBtnAriaLabel="Close notification"
            closeable
            date-time="Wednesday, May 11 at 1:13pm"
            has-border
            headline="Notification heading"
            headline-level="3"
            href="#"
            symbol="none"
            text="Manage your notifications"
            visible
          >
            <p>Notification body</p>
          </va-notification>

          <hr />

          <h3>va-checkbox</h3>

          <va-checkbox
            description={null}
            error={null}
            hint={null}
            label="This is a cleverly-labelled checkbox"
            enable-analytics
          />

          <hr />

          <h3>va-checkbox-group</h3>

          <va-checkbox-group
            error={null}
            hint={null}
            label="This is a label"
            enable-analytics
          >
            <va-checkbox label="Option one" name="example" value="1" />
            <va-checkbox label="Option two" name="example" value="2" />
          </va-checkbox-group>

          <hr />

          <h3>va-date</h3>

          <va-date
            label="What’s the date or anticipated date of your release from active duty?"
            name="discharge-date"
            enable-analytics
          />

          <hr />

          <h3>va-memorable-date</h3>

          <va-memorable-date
            hint=""
            label="Date of birth"
            name="test"
            enable-analytics
          />

          <hr />

          <h3>va-link</h3>

          <va-link
            href="#"
            text="Contact a local Veterans Service Organization (VSO)"
          />

          <hr />

          <h3>va-loading-indicator</h3>

          <va-loading-indicator
            label="Loading"
            message="Loading your application..."
          />

          <hr />

          <h3>va-modal</h3>

          <va-button
            text="Click here to open modal"
            onClick={handleModalOpen}
          />
          <va-modal
            id="my-modal"
            modal-title="Modal title goes here"
            status="info"
            primary-button-text="Primary button"
            secondary-button-text="Secondary button"
          >
            <p>
              A modal may pass any React nodes as children to be displayed
              within it.
            </p>
            <p>
              By default, a modal may have up to one primary button, and up to
              one secondary button. Check the console log when clicking the
              buttons to see the events fired.
            </p>
            <p>If more buttons are required, pass them in as children.</p>
          </va-modal>

          <hr />

          <h3>va-number-input</h3>

          <va-number-input
            hint={null}
            inputmode="numeric"
            label="My input"
            name="my-input"
            value={0}
          />

          <hr />

          <h3>va-select</h3>

          <va-select
            hint={null}
            label="Branch of Service"
            name="branch"
            value="army"
            enable-analytics
          >
            <option value="navy">Navy</option>
            <option value="army">Army</option>
            <option value="marines">Marines</option>
            <option value="air-force">Air Force</option>
            <option value="coastguard">Coastguard</option>
          </va-select>

          <hr />

          <h3>va-radio</h3>

          <va-radio
            error={null}
            hint=""
            label="This is a label"
            label-header-level=""
            enable-analytics
          >
            <va-radio-option
              enable-analytics
              label="Option one"
              name="example"
              value="1"
            />
            <va-radio-option
              label="Option two with an extra long label, so we can get it to wrap"
              name="example"
              value="2"
              enable-analytics
            />
          </va-radio>

          <hr />

          <h3>va-pagination</h3>

          <va-pagination page={3} pages={15} showLastPage enable-analytics />

          <hr />

          <h3>va-progress-bar</h3>

          <va-progress-bar enable-analytics percent={100} />

          <hr />

          <h3>va-segmented-progress-bar</h3>

          <va-segmented-progress-bar current={6} total={6} enable-analytics />

          <hr />

          <DowntimeNotification
            appTitle="facility locator tool"
            dependencies={[externalServices.arcgis]}
          >
            <div className="facility-locator">{this.props.children}</div>
          </DowntimeNotification>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedResult: state.searchResult.selectedResult,
    searchQuery: state.searchQuery,
    results: state.searchResult.results,
  };
}

export default connect(
  mapStateToProps,
  null,
)(FacilityLocatorApp);
