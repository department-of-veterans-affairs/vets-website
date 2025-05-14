import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommunicationChannelModel from '@@profile/models/CommunicationChannel';
import {
  saveCommunicationPreferenceChannel,
  selectChannelById,
  //   selectChannelUiById,
} from '@@profile/ducks/communicationPreferences';
import { selectCommunicationPreferences } from '@@profile/reducers';
import PropTypes from 'prop-types';
import {
  selectVAPEmailAddress,
  selectVAPMobilePhone,
} from '~/platform/user/selectors';

const FacilityClinicDetailsOptIn = ({
  detailsText,
  descriptionText,
  channelIds,
  channelsByItemId,
  borderColor = '#97D4EA',
  paddingLeft = '10px',
  margin = '10px 0',
  marginLeft = '30px',
  disabledForCheckbox,
}) => {
  const dispatch = useDispatch();

  //   const [selectedType, setSelectedType] = useState(null);

  //   useEffect(() => {
  //     if (!disabledForCheckbox) {
  //       setSelectedType(null);
  //     }
  //   }, [disabledForCheckbox]);

  const getType = id => parseInt(id.split('-')[1], 10);

  const getItemId = id => parseInt(id.split('channel')[1].split('-')[0], 10);

  const communicationPreferencesState = useSelector(
    selectCommunicationPreferences,
  );

  const hasEmail = useSelector(state => selectVAPEmailAddress(state));

  const hasMobile = useSelector(state => selectVAPMobilePhone(state));

  const getChannelById = channelId => {
    return selectChannelById(communicationPreferencesState, channelId);
  };

  //   const uiState = channelId => {
  //     return selectChannelUiById(communicationPreferencesState, channelId);
  //   };

  const checkContactInfo = channelType => {
    if (channelType === 1) return hasEmail;
    return hasMobile;
  };

  const handleCheckboxChange = (e, id) => {
    const channel = getChannelById(id);
    const type = getType(id);
    // const apiStatus = uiState(id).updateStatus;

    // setSelectedType(type);

    const { permissionId } = channel;
    const wasAllowed = channel.isAllowed;

    const model = new CommunicationChannelModel({
      type,
      parentItemId: getItemId(id),
      permissionId,
      isAllowed: wasAllowed,
      wasAllowed,
      sensitive: e.target.checked,
    });

    dispatch(saveCommunicationPreferenceChannel(id, model.getApiCallObject()));
  };

  const getCheckboxLabel = channelId =>
    `Include facility and clinic details in ${
      channelId.endsWith('1') ? 'text' : 'email'
    } notifications`;

  const allowedChannels = channelsByItemId.filter(item => item.isAllowed);

  if (allowedChannels.length === 0) {
    return null;
  }

  const allowedChannelIds = channelIds.filter(id => {
    const type = getType(id);
    const matchingItem = channelsByItemId.find(
      item => item.channelType === type && item.isAllowed,
    );
    return !!matchingItem;
  });

  //   if (selectedType && !disabledForCheckbox) setSelectedType(null);

  return (
    <div
      style={{
        borderLeft: `4px solid ${borderColor}`,
        paddingLeft,
        margin,
        marginLeft,
        borderTop: '1px solid red',
      }}
    >
      {detailsText && <p>{detailsText}</p>}
      {descriptionText && (
        <p
          style={{
            margin: '4px 0 10px',
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#6a6a6a',
          }}
        >
          {descriptionText}
        </p>
      )}
      {allowedChannelIds.map(id => {
        const type = getType(id);
        const matchingItem = channelsByItemId.find(
          item => item.channelType === type,
        );

        //  || checkContactInfo(type)
        // Only display the VaCheckbox if the sensitiveIndicator is true or has correct contact info
        if (!matchingItem?.sensitiveIndicator || !checkContactInfo(type)) {
          return null;
        }
        // console.log({type, selectedType});
        // console.log('CSS Debugging:', {
        //   type,
        //   selectedType,
        //   className: type === selectedType ? 'vads-u-display--none' : '',
        // });

        return (
          <div key={id}>
            {disabledForCheckbox ? (
              <VaCheckbox
                id={id}
                checked={matchingItem?.sensitive}
                label={getCheckboxLabel(id)}
                onVaChange={e => handleCheckboxChange(e, id)}
                disabled
                // className={type === selectedType ? 'vads-u-display--none' : ''}
              />
            ) : (
              <VaCheckbox
                id={id}
                checked={matchingItem?.sensitive}
                label={getCheckboxLabel(id)}
                onVaChange={e => handleCheckboxChange(e, id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

FacilityClinicDetailsOptIn.propTypes = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  channelsByItemId: PropTypes.arrayOf(PropTypes.object).isRequired,
  borderColor: PropTypes.string,
  descriptionText: PropTypes.string,
  detailsText: PropTypes.string,
  disabledForCheckbox: PropTypes.bool,
  margin: PropTypes.string,
  marginLeft: PropTypes.string,
  paddingLeft: PropTypes.string,
};

export default FacilityClinicDetailsOptIn;
