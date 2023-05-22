import React from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ROUTES } from '../constants';

const ReviewPage = ({ router }) => {
  const onContinueClick = () => {
    router.push(ROUTES.RESULTS);
  };

  const onBackClick = () => {
    router.push(ROUTES.DEPENDENTS);
  };
  return (
    <>
      <h1>Aenean tristique mollis</h1>
      <p>Fusce risus lacus, efficitur ac magna vitae, cursus lobortis dui.</p>
      <table className="usa-table-borderless" data-testid="il-review">
        <tbody>
          <tr>
            <td>
              <strong>Curabitur dictum:</strong>
              <br aria-hidden="true" /> Yes
            </td>
          </tr>
          <tr>
            <td>
              <strong>Nulla at mauris non:</strong>
              <br aria-hidden="true" /> No
            </td>
          </tr>
          <tr>
            <td>
              <strong>Class aptent:</strong>
              <br aria-hidden="true" /> No
            </td>
          </tr>
          <tr>
            <td>
              <strong>Nisci orci:</strong>
              <br aria-hidden="true" /> 00000
            </td>
          </tr>
          <tr>
            <td>
              <strong>Malesuada felis ultrices:</strong>
              <br aria-hidden="true" /> 0
            </td>
          </tr>
        </tbody>
      </table>
      <VaButtonPair
        data-testid="il-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

ReviewPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ReviewPage;
