// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const App = ({ show }) => {
  return show ? (
    <div>
      <h2>How do I request a Board Appeal?</h2>
      <p>You can request a Board Appeal online right now.</p>
      <a
        href="/decision-reviews/board-appeal/request-board-appeal-form-10182"
        className="vads-c-action-link--green"
      >
        Request a Board Appeal
      </a>

      <h3>You can also request a Board Appeal in any of these ways:</h3>

      <h4>By mail</h4>
      <p>
        Fill out a Decision Review Request: Board Appeal (Notice of
        Disagreement) (VA Form 10182)
      </p>

      <p>
        <a href="/find-forms/about-form-10182">Get VA Form 10182 to download</a>
      </p>

      <p>
        <strong>Note:</strong> You can also get this form from a VA regional
        office. Or, you can call us at <va-telephone contact="8008271000" /> to
        request a form. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        ET.
      </p>

      <p>Send the completed form to this address:</p>

      <p className="va-address-block">
        Board of Veterans’ Appeals
        <br />
        PO Box 27063
        <br />
        Washington, D.C. 20038
      </p>

      <h4>In person</h4>

      <p>
        Bring your completed form to a VA regional office.
        <br />
        <a href="/find-locations/">Find a VA regional office near you</a>
      </p>

      <h4>By fax</h4>

      <p>Fax your completed form to 844-678-8979.</p>
    </div>
  ) : (
    <div>
      <h2>How do I request a Board Appeal?</h2>
      <p>You can request a Board Appeal in any of these ways:</p>

      <h3>By mail</h3>
      <p>
        Fill out a Decision Review Request: Board Appeal (Notice of
        Disagreement) (VA Form 10182).
      </p>

      <p>
        <a href="/find-forms/about-form-10182">Get VA Form 10182 to download</a>
      </p>

      <p>
        <strong>Note:</strong> You can also get this form from a VA regional
        office. Or, you can call us at <va-telephone contact="8008271000" /> to
        request a form. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        ET.
      </p>

      <p>Send the completed form to this address:</p>

      <p className="va-address-block">
        Board of Veterans’ Appeals
        <br />
        PO Box 27063
        <br />
        Washington, D.C. 20038
      </p>

      <h3>In person</h3>
      <p>
        Bring your completed form to a VA regional office.
        <br />
        <a href="/find-locations/">Find a VA regional office near you</a>
      </p>

      <h3>By fax</h3>
      <p>Fax your completed form to 844-678-8979.</p>
    </div>
  );
};

App.propTypes = {
  // From mapStateToProps.
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.form10182Nod,
});

export default connect(
  mapStateToProps,
  null,
)(App);
