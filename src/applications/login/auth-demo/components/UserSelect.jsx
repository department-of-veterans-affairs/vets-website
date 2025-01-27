import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useAuth } from '../context/AuthContext';

const UserSelect = ({ onSelectUser, testAccounts }) => {
  const [selectedTestAccount, setSelectedTestAccount] = useState(
    testAccounts[0].id,
  );
  const { original, isModalVisible, setIsModalVisible } = useAuth();

  const handleTestAccountChange = e => {
    setSelectedTestAccount(e.target.value);
  };

  const handleSwitchToTestAccount = () => {
    onSelectUser(selectedTestAccount);
    setIsModalVisible(false);
  };

  const handleContinueAsCurrentUser = () => {
    onSelectUser('original');
    setIsModalVisible(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <VaModal
        modalTitle="Production Test User Access"
        visible={isModalVisible}
        onCloseEvent={() => setIsModalVisible(false)}
        primaryButtonText="Switch to Selected Test Account"
        onPrimaryButtonClick={handleSwitchToTestAccount}
        secondaryButtonText="Continue as Current User"
        onSecondaryButtonClick={handleContinueAsCurrentUser}
        large="true"
        status="info"
      >
        <p>
          Welcome, {original}! <br />
          <br />
          You have logged in with an account that has access to production test
          users. Would you like to continue as the current user, or switch to
          one of the available test accounts?
        </p>

        <div style={{ marginBottom: '1em', textAlign: 'left' }}>
          <label
            htmlFor="testAccountSelect"
            style={{ marginRight: '0.5em', fontWeight: 'bold' }}
          >
            Choose a Test Account:
          </label>
          <select
            id="testAccountSelect"
            value={selectedTestAccount}
            onChange={handleTestAccountChange}
            style={{ marginRight: '0.5em' }}
          >
            {testAccounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.user.name}
              </option>
            ))}
          </select>
        </div>
      </VaModal>
    </div>
  );
};

export default UserSelect;
