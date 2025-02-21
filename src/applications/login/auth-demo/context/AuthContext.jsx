import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [original, setOriginal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState('signIn');

  const mockUsers = [
    {
      id: 'janeDoe',
      user: {
        name: 'Jane Doe',
        birthDate: '1989-06-15',
        gender: 'Female',
        preferredName: 'Jane',
        email: 'jane.doe@example.com',
        phoneNumber: '555-123-4567',
        address: {
          street: '123 Main St',
          city: 'Baltimore',
          state: 'MD',
          postalCode: '21201',
        },
      },
      militaryInformation: {
        branchOfService: 'U.S. Army',
        dischargeStatus: 'Honorable',
        rank: 'Sergeant',
        servicePeriods: [{ startDate: '2010-01-15', endDate: '2015-08-30' }],
      },
      disabilityRating: { rating: 60, effectiveDate: '2016-01-01' },
      directDeposit: {
        bankName: 'Veterans Bank',
        accountNumber: '****1234',
        accountType: 'Checking',
      },
    },
    {
      id: 'johnSmith',
      user: {
        name: 'John Smith',
        birthDate: '1985-03-22',
        gender: 'Male',
        preferredName: 'John',
        email: 'john.smith@example.com',
        phoneNumber: '555-987-6543',
        address: {
          street: '456 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
        },
      },
      militaryInformation: {
        branchOfService: 'U.S. Navy',
        dischargeStatus: 'Honorable',
        rank: 'Petty Officer',
        servicePeriods: [{ startDate: '2008-05-20', endDate: '2014-11-15' }],
      },
      disabilityRating: { rating: 40, effectiveDate: '2015-02-01' },
      directDeposit: {
        bankName: 'US Military Bank',
        accountNumber: '****5678',
        accountType: 'Savings',
      },
    },
  ];

  const signIn = userId => {
    setOriginal(userId);
  };

  const selectUser = userId => {
    const aUser = mockUsers.find(u => u.id === userId);
    if (aUser) {
      setUser(userId);
      setUserData(aUser);
      setIsModalVisible(false);
      setStep('profile');
    }
  };

  const endSession = () => {
    setUser(null);
    setUserData({});
    setStep('signIn');
  };

  const hideElements = () => {
    const elementsToHide = [
      'vetnav-menu',
      'login-root',
      'search-header-dropdown-component',
      'menu-rule',
      'va-nav-controls',
    ];

    elementsToHide.forEach(selector => {
      const element =
        document.getElementById(selector) ||
        document.querySelector(`.${selector}`);
      if (element) element.style.display = 'none';
    });
  };

  const showElements = () => {
    const elementsToShow = [
      'vetnav-menu',
      'login-root',
      'search-header-dropdown-component',
      'menu-rule',
      'va-nav-controls',
    ];

    elementsToShow.forEach(selector => {
      const element =
        document.getElementById(selector) ||
        document.querySelector(`.${selector}`);
      if (element) element.style.display = 'initial';
    });
  };

  const goToStep = newStep => {
    setStep(newStep);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        signIn,
        selectUser,
        endSession,
        mockUsers,
        original,
        isModalVisible,
        setIsModalVisible,
        hideElements,
        showElements,
        step,
        goToStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
