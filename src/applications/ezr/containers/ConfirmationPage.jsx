import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import { normalizeFullName } from '../utils/helpers/general';

const ConfirmationPage = ({ form, profile }) => {
  const {
    submission: { response },
  } = form;
  const { userFullName } = profile;
  const veteranName = normalizeFullName(userFullName, true);

  return (
    <div className="ezr-confirmation-page vads-u-margin-bottom--2p5">
      <section className="ezr-confirmation--screen no-print">
        <ConfirmationScreenView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section className="ezr-confirmation--print">
        <ConfirmationPrintView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section>
        <h2>Next Steps Title</h2>
        <p>Next steps content...</p>
      </section>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = state => ({
  form: state.form,
  profile: state.user.profile,
});

export default connect(mapStateToProps)(ConfirmationPage);
