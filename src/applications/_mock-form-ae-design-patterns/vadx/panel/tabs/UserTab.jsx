import {
  VaButton,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { USA_MILITARY_BRANCHES } from '@@profile/constants';
import { orderBy } from 'lodash';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';
import styled from 'styled-components';

const SaveButtonDiv = styled.div`
  position: sticky;
  text-align: right;
  right: 0px;
  bottom: 5px;
`;

const LoginServiceOptions = Object.values(SERVICE_PROVIDERS).map(service => {
  return (
    <option key={service.policy} value={service.policy}>
      {service.label}
    </option>
  );
});

export const UserTab = () => {
  const dispatch = useDispatch();

  const fullName = useSelector(state => state?.vaProfile?.hero?.userFullName);
  const [firstName, setFirstName] = useState(fullName?.first || '');
  const [middleInitial, setMiddleInitial] = useState(fullName?.middle || '');
  const [lastName, setLastName] = useState(fullName?.last || '');

  const latestBranchOfService = useSelector(
    state =>
      orderBy(
        state.vaProfile?.militaryInformation?.serviceHistory?.serviceHistory,
        ['endDate'],
        'desc',
      )[0]?.branchOfService,
  );

  const profile = useSelector(state => state?.user?.profile);

  const [selectedBranch, setSelectedBranch] = useState(latestBranchOfService);

  const branchOptions = Object.values(USA_MILITARY_BRANCHES);

  const militaryHistory = useSelector(
    state =>
      state.vaProfile?.militaryInformation?.serviceHistory?.serviceHistory,
  );

  const [loginService, setLoginService] = useState(
    useSelector(state => state?.user?.profile?.signIn?.serviceName) || '',
  );

  const profileTextArea = React.createRef();

  // set the height of the textarea to fit the content
  React.useEffect(
    () => {
      if (profileTextArea.current) {
        profileTextArea.current.style.height = 'auto';
        profileTextArea.current.style.height = `${profileTextArea.current
          .scrollHeight + 3}px`;
      }
    },
    [profile, profileTextArea],
  );

  const generateMilitaryHistoryPayload = branch => {
    return {
      type: 'FETCH_MILITARY_INFORMATION_SUCCESS',
      militaryInformation: {
        serviceHistory: {
          dataSource: 'api.va_profile',
          serviceHistory: militaryHistory.map(history => {
            return {
              ...history,
              branchOfService: branch,
            };
          }),
        },
      },
    };
  };

  const saveUser = () => {
    dispatch({
      type: 'FETCH_HERO_SUCCESS',
      hero: {
        userFullName: {
          first: firstName,
          middle: middleInitial,
          last: lastName,
          suffix: null,
        },
      },
    });

    dispatch(generateMilitaryHistoryPayload(selectedBranch));
  };

  return (
    <div>
      <h2 className="vads-u-margin--0 vads-u-font-size--sm">Profile</h2>
      <div className="vads-u-display--flex vads-l-row vads-u-margin-bottom--2">
        <div className="vads-l-col--5">
          <span className="vads-u-margin-right--1 vads-u-margin--0">
            First Name
          </span>
          <VaTextInput
            value={firstName}
            onInput={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="vads-l-col--1">
          <span className="vads-u-margin-right--1 vads-u-margin--0 ">M.I.</span>
          <VaTextInput
            value={middleInitial}
            onInput={e => setMiddleInitial(e.target.value)}
            width="2xs"
          />
        </div>
        <div>
          <span className="vads-u-margin-right--1 vads-u-margin--0">
            Last Name
          </span>
          <VaTextInput
            value={lastName}
            onInput={e => setLastName(e.target.value)}
          />
        </div>
      </div>

      <VaSelect
        label="Branch of Service"
        value={selectedBranch}
        onVaSelect={e => setSelectedBranch(e.target.value)}
      >
        {branchOptions.map(branch => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </VaSelect>

      <VaSelect
        label="Login Service"
        value={loginService}
        onVaSelect={e => setLoginService(e.target.value)}
      >
        {LoginServiceOptions}
      </VaSelect>

      <textarea
        ref={profileTextArea}
        label="Profile"
        value={JSON.stringify(profile, null, 2)}
      />

      <SaveButtonDiv>
        <VaButton text="💾 Save" onClick={saveUser} />
      </SaveButtonDiv>
    </div>
  );
};
