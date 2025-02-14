import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useAuth } from '../context/AuthContext';
import UserSelectPage from './UserSelectPage';

const UserSelect = ({ onSelectUser, testAccounts, modal = false }) => {
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

  // Render content without the modal if `modal` is false
  const userSelectionContent = (
    <div style={{ textAlign: 'center' }}>
      <p>
        Welcome, {original}! <br />
        <br />
        You have logged in with an account that has access to delegate on behalf
        of other users. Would you like to continue as the current user, or
        switch to acting on behalf of one of the available accounts?
      </p>

      <div style={{ marginBottom: '1em', textAlign: 'left' }}>
        <label
          htmlFor="testAccountSelect"
          style={{ marginRight: '0.5em', fontWeight: 'bold' }}
        >
          Choose an Account:
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

      <div>
        <button onClick={handleSwitchToTestAccount}>
          Switch to Selected Test Account
        </button>
        <button onClick={handleContinueAsCurrentUser}>
          Continue as Current User
        </button>
      </div>
    </div>
  );

  if (modal) {
    return (
      <div style={{ textAlign: 'center' }}>
        <VaModal
          modalTitle="Select an Account"
          visible={isModalVisible}
          onCloseEvent={() => setIsModalVisible(false)}
          primaryButtonText="Switch to Selected Test Account"
          onPrimaryButtonClick={handleSwitchToTestAccount}
          secondaryButtonText="Continue as Current User"
          onSecondaryButtonClick={handleContinueAsCurrentUser}
          large="true"
          status="info"
        >
          {userSelectionContent}
        </VaModal>
      </div>
    );
  }

  // Render content without the modal if `modal` is false
  return <UserSelectPage userSelectionContent={userSelectionContent} />;
};

export default UserSelect;
