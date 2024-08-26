import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mutePressed } from '../../actions';
import LabelledButton from './LabelledButton';

const MuteButton = () => {
  const { isMuted } = useSelector(({ call }) => call);
  const dispatch = useDispatch();
  const onClick = useCallback(() => dispatch(mutePressed()), [dispatch]);

  return (
    <LabelledButton label="Mute">
      <svg
        width="78"
        height="79"
        viewBox="0 0 78 79"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="mute-button"
        onClick={onClick}
        className={classNames([
          'hover:cursor-pointer',
          'hover:phone-button-active-bg',
          'group',
          {
            'phone-button-pressed-bg': isMuted,
          },
        ])}
      >
        <path
          d="M77.5 39.0326C77.5 60.314 60.2626 77.5652 39 77.5652C17.7374 77.5652 0.5 60.314 0.5 39.0326C0.5 17.7512 17.7374 0.5 39 0.5C60.2626 0.5 77.5 17.7512 77.5 39.0326Z"
          stroke="#636366"
        />
        <path
          d="M38.717 45.4364C41.7422 45.4364 44.0885 42.6644 44.0885 38.5604V26.3923C44.0885 22.2883 41.7422 19.5163 38.717 19.5163C35.6771 19.5163 33.3307 22.2883 33.3307 26.3923V38.5604C33.3307 42.6644 35.6771 45.4364 38.717 45.4364ZM27 39.0464C27 46.7324 31.2205 51.8984 37.1823 52.6544V55.9664H31.8108C30.9253 55.9664 30.2023 56.8304 30.2023 57.8924C30.2023 58.9544 30.9253 59.8364 31.8108 59.8364H45.6233C46.4939 59.8364 47.2318 58.9544 47.2318 57.8924C47.2318 56.8304 46.4939 55.9664 45.6233 55.9664H40.237V52.6544C46.2135 51.8984 50.4193 46.7324 50.4193 39.0464V35.5544C50.4193 34.4923 49.7109 33.6643 48.8255 33.6643C47.9401 33.6643 47.217 34.4923 47.217 35.5544V38.9204C47.217 45.0404 43.7196 49.0724 38.717 49.0724C33.6997 49.0724 30.217 45.0404 30.217 38.9204V35.5544C30.217 34.4923 29.4792 33.6643 28.6085 33.6643C27.7231 33.6643 27 34.4923 27 35.5544V39.0464Z"
          fill="#636366"
          className={classNames([
            'group-hover:text-white',
            { 'fill-white': isMuted },
          ])}
        />
        <line
          x1="25.5742"
          y1="22.9147"
          x2="52.4474"
          y2="53.6269"
          stroke="#636366"
          strokeWidth="2"
          strokeLinecap="round"
          className={classNames([
            'group-hover:stroke-white',
            { 'stroke-white': isMuted },
          ])}
        />
      </svg>
    </LabelledButton>
  );
};

export default MuteButton;
