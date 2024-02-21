import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import Wrapper from '../../layout/Wrapper';

const TravelIntroDisplay = ({ header, buttonClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <Wrapper pageTitle={header} classNames="travel-page">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
          <va-button
            uswds
            big
            onClick={buttonClick}
            text={t('yes')}
            data-testid="yes-button"
            class="vads-u-margin-top--2"
            value="yes"
          />
        </div>
      </Wrapper>
    </>
  );
};
TravelIntroDisplay.propTypes = {
  buttonClick: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};
export default TravelIntroDisplay;
