import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './components/SignIn';
import UserSelect from './components/UserSelect';
import Profile from './components/Profile';
import PersonalInformationPage from './components/PersonalInformation';
import ActiveAccountBanner from './components/Banner';
import Breadcrumbs from './components/Breadcrumbs';

const AuthDemo = () => {
  const [step, setStep] = useState('signIn');
  const [initialDisplayStyles, setInitialDisplayStyles] = useState({});
  const {
    mockUsers,
    userData,
    signIn,
    selectUser,
    endSession,
    isModalVisible,
    setIsModalVisible,
  } = useAuth();

  const manageHeaderDisplay = show => {
    const elementsToManage = [
      { id: 'vetnav-menu', display: 'flex' },
      { id: 'login-root', display: 'block' },
      { id: 'search-header-dropdown-component', display: 'block' },
      { id: 'va-nav-controls', display: 'inherit' },
      { selector: '.menu-rule', display: 'block' },
      { selector: '.sign-in-link', display: 'none' },
      { selector: '.vetnav-controller-close', display: 'none' },
      { selector: '.mega-menu', display: 'flex' },
      { selector: '.va-notice--banner', display: 'block' },
      { selector: '.va-crisis-line-container', display: 'flex' },
    ];

    elementsToManage.forEach(({ id, selector, display }) => {
      const elements = id
        ? [document.getElementById(id)]
        : document.querySelectorAll(selector);

      elements.forEach(e => {
        if (e) {
          e.style.display = show ? display : 'none';
        }
      });
    });
  };

  useEffect(() => {
    const initialStyles = {};
    const elementsToManage = [
      { id: 'vetnav-menu' },
      { id: 'login-root' },
      { id: 'search-header-dropdown-component' },
      { id: 'va-nav-controls' },
      { selector: '.menu-rule' },
      { selector: '.mega-menu' },
      { selector: '.va-notice--banner' },
      { selector: '.va-crisis-line-container' },
    ];

    elementsToManage.forEach(({ id, selector }) => {
      const element = id
        ? document.getElementById(id)
        : document.querySelector(selector);
      if (element) {
        initialStyles[id || selector] = element.style.display || 'block'; // Store the current or default display style
      }
    });
    setInitialDisplayStyles(initialStyles);
  }, []);

  useEffect(
    () => {
      switch (step) {
        case 'signIn':
        case 'userSelect':
          manageHeaderDisplay(false);
          break;

        case 'profile':
        case 'personalInformation':
          manageHeaderDisplay(true);
          break;

        default:
          Object.keys(initialDisplayStyles).forEach(key => {
            const element = document.querySelector(key);
            if (element) {
              element.style.display = initialDisplayStyles[key];
            }
          });
          break;
      }
    },
    [step, initialDisplayStyles],
  );

  useEffect(
    () => {
      if (step === 'profile' || step === 'personalInformation') {
        const signInLinksDiv = document.querySelector('.sign-in-links');
        if (signInLinksDiv) {
          const existingButton = signInLinksDiv.querySelector(
            '.sign-in-drop-down-panel-button',
          );
          if (existingButton) {
            existingButton.remove();
          }

          const fullName = userData?.user?.name || '';
          const firstName = fullName.split(' ')[0];
          const button = document.createElement('button');
          button.className =
            'sign-in-drop-down-panel-button va-btn-withicon va-dropdown-trigger';
          button.setAttribute('aria-controls', 'account-menu');
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('type', 'button');

          button.innerHTML = `
        <span>
          <svg aria-hidden="true" focusable="false" class="vads-u-display--block vads-u-margin-right--0 medium-screen:vads-u-margin-right--0p5" viewBox="0 2 21 21" xmlns="http://www.w3.org/2000/svg" style="width: 26px; height: 24px;">
            <path fill="#fff" d="M12 12c-1.1 0-2.04-.4-2.82-1.18A3.85 3.85 0 0 1 8 8c0-1.1.4-2.04 1.18-2.83A3.85 3.85 0 0 1 12 4c1.1 0 2.04.4 2.82 1.17A3.85 3.85 0 0 1 16 8c0 1.1-.4 2.04-1.18 2.82A3.85 3.85 0 0 1 12 12Zm-8 8v-2.8c0-.57.15-1.09.44-1.56a2.9 2.9 0 0 1 1.16-1.09 13.76 13.76 0 0 1 9.65-1.16c1.07.26 2.12.64 3.15 1.16.48.25.87.61 1.16 1.09.3.47.44 1 .44 1.56V20H4Z"></path>
          </svg>
          <span class="user-dropdown-email" data-dd-privacy="mask" data-dd-action-name="First Name">${firstName}</span>
        </span>
      `;

          signInLinksDiv.appendChild(button);
        }
      } else {
        const signInLinksDiv = document.querySelector('.sign-in-links');
        if (signInLinksDiv) {
          const existingButton = signInLinksDiv.querySelector(
            '.sign-in-drop-down-panel-button',
          );
          if (existingButton) {
            existingButton.remove();
          }
        }
      }
    },
    [step, userData],
  );

  const handleHomeClick = () => setStep('signIn');
  const handleProfileClick = () => setStep('profile');
  const handlePersonalInfoClick = () => setStep('personalInformation');

  const handleSignIn = username => {
    signIn(username);
    setIsModalVisible(true);
  };

  const handleSelectUser = userType => {
    selectUser(userType);
    setIsModalVisible(false);
    setStep('profile');
  };

  const handleEndSession = () => {
    endSession();
    setStep('signIn');
  };

  const openUserSelectModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div>
      {step !== 'signIn' && (
        <>
          <ActiveAccountBanner
            onEndSession={handleEndSession}
            onChangeUser={openUserSelectModal}
          />
          <div className="vads-u-background-color--primary vads-u-margin-bottom--0 vads-u-padding-y--2 medium-screen:vads-u-padding-y--2p5 medium-screen:vads-u-margin-bottom--2">
            <div
              className="vads-l-grid-container"
              style={{ maxWidth: '1030px', color: 'white' }}
            >
              <h4 style={{ padding: '0', marginTop: '8.5' }}>
                {userData?.user?.name}
              </h4>
            </div>
          </div>
        </>
      )}
      {step !== 'signIn' && (
        <div className="vads-l-grid-container">
          <Breadcrumbs
            step={step}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onPersonalInfoClick={handlePersonalInfoClick}
          />
        </div>
      )}

      <div className="vads-l-grid-container">
        {step === 'signIn' && <SignIn onSignIn={handleSignIn} />}

        {step === 'profile' && (
          <Profile
            onEndSession={handleEndSession}
            onChangeUser={openUserSelectModal}
            onViewPersonalInformation={() => setStep('personalInformation')}
          />
        )}
        {step === 'personalInformation' && (
          <PersonalInformationPage
            profileData={userData}
            onBack={() => setStep('profile')}
          />
        )}
      </div>

      {isModalVisible && (
        <UserSelect onSelectUser={handleSelectUser} testAccounts={mockUsers} />
      )}
    </div>
  );
};

const AuthApp = () => (
  <AuthProvider>
    <AuthDemo />
  </AuthProvider>
);

export default AuthApp;
