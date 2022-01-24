import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

const CopyAddressModal = props => {
  const { isVisible, onYes, onNo } = props;
  return (
    <Modal
      title="Do you also want to update your mailing address?"
      visible={isVisible}
      primaryButton={{
        action: () => {
          // console.log('YES!');
          onYes();
        },
        text: 'Yes',
      }}
      secondaryButton={{
        action: () => {
          // console.log('NO!');
          onNo();
        },
        text: 'No',
      }}
    >
      <>
        <p>
          We’ve updated your home address to this address:
          <br />
          <strong>
            811 Vermont Ave NW
            <br />
            Washington, DC 20571
          </strong>
        </p>
        <p>
          We send your prescriptions and letters to your mailing address. This
          is the mailing address we have on file for you:
          <br />
          <strong>
            1221 Douglas Way
            <br />
            Douglas, MA 14355
          </strong>
        </p>
        <p>
          Do you want to update your mailing address to match your updated home
          address?
        </p>
      </>
    </Modal>
  );
};

CopyAddressModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
};

export default CopyAddressModal;
