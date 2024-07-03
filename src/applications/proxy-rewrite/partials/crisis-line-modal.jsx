/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';

const CrisisLineModal = () => (
  <div id="ts-modal-crisisline" className="vcl-overlay va-modal va-modal-large" role="alertdialog">
    <div className="vcl-crisis-panel va-modal-inner">
      <button aria-label="Close this modal" id="vcl-modal-close" type="button">
        <svg
          aria-hidden="true"
          focusable="false"
          id="close-button-icon"
          viewBox="2 2 20 20"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
        >
        <path
          fill="#005ea2"
          d="m8.4 17 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7 12 10.6 8.4 7 7 8.4l3.6 3.6L7 15.6 8.4 17Zm3.6 5a10.1 10.1 0 0 1-9.21-6.1A9.74 9.74 0 0 1 2 12a10.1 10.1 0 0 1 6.1-9.21A9.74 9.74 0 0 1 12 2a10.1 10.1 0 0 1 9.21 6.1c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.1 10.1 0 0 1-5.31 5.31A9.74 9.74 0 0 1 12 22Z"
        />
      </svg>
      </button>
      <div className="vcl-overlay-body vcl-crisis-panel-body">
        <h3 className="vcl-crisis-panel-title">We’re here anytime, day or night – 24/7</h3>
        <p>If you are a Veteran in crisis or concerned about one, connect with our caring, qualified responders for confidential help. Many of them are Veterans themselves.</p>
        <ul className="vcl-crisis-panel-list">
          <li>
            <svg
              aria-hidden="true"
              className="vcl-crisis-panel-icon vads-u-display--inline-block"
              focusable="false"
              style={{transform: 'rotate(270deg)'}}
              viewBox="0 0 23 23"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
              />
            </svg>
            <a href="tel:988">Call <strong>988 and select 1</strong></a>
          </li>
          <li>
            <svg
              aria-hidden="true"
              className="vcl-crisis-panel-icon"
              focusable="false"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000"
                d="M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1Zm-4 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4.5-4H7V4h9v14Z"
              />
            </svg>
            <a href="sms:838255">Text <strong>838255</strong>
            </a>
          </li>
          <li>
            <svg
              aria-hidden="true"
              className="vcl-crisis-panel-icon"
              focusable="false"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21 6H19V15H6V17C6 17.55 6.45 18 7 18H18L22 22V7C22 6.45 21.55 6 21 6ZM17 12V3C17 2.45 16.55 2 16 2H3C2.45 2 2 2.45 2 3V17L6 13H16C16.55 13 17 12.55 17 12Z"
              />
            </svg>
            <a className="no-external-icon" href="https://www.veteranscrisisline.net/get-help-now/chat/">Start a confidential chat</a>
          </li>
          <li>
            <svg
              aria-hidden="true"
              className="vcl-crisis-panel-icon"
              focusable="false"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#1B1B1B"
                fillRule="evenodd"
                d="m20.51 22-6.79-6.79c-.34.28-.62.52-.86.75-.24.22-.44.45-.6.7a6.72 6.72 0 0 0-.48.8 11.8 11.8 0 0 0-.44 1.03c-.31.81-.8 1.45-1.45 1.9a3.84 3.84 0 0 1-2.25.7 3.3 3.3 0 0 1-2.36-.95 3.52 3.52 0 0 1-1.1-2.34h1.38a2.19 2.19 0 0 0 .7 1.37 2 2 0 0 0 1.38.54c.55 0 1.04-.18 1.46-.52a3.9 3.9 0 0 0 1.07-1.55 11.2 11.2 0 0 1 1.1-2c.21-.27.44-.53.67-.76a8.24 8.24 0 0 1 .77-.68L5.83 7.32a6.64 6.64 0 0 0-.2.72 5.16 5.16 0 0 0-.1.77H4.16a8.29 8.29 0 0 1 .2-1.33c.1-.43.23-.83.41-1.21L2 3.49l.99-.99 18.5 18.51-.98.99Zm-2.32-6.26-.98-.99a8.6 8.6 0 0 0 1.56-2.7A9.05 9.05 0 0 0 19.29 9c0-1.17-.2-2.28-.6-3.33a7.82 7.82 0 0 0-1.78-2.74L17.94 2a9.5 9.5 0 0 1 2.02 3.17 10.4 10.4 0 0 1 .08 7.4 10.5 10.5 0 0 1-1.85 3.17Zm-2.52-2.52-1.05-1.06a5.57 5.57 0 0 0 .78-3.07c0-1.38-.47-2.54-1.4-3.48a4.68 4.68 0 0 0-3.47-1.4c-.56 0-1.1.07-1.6.22a5.16 5.16 0 0 0-1.38.67l-.99-.99a6.34 6.34 0 0 1 1.84-.95 6.77 6.77 0 0 1 2.13-.33c1.84 0 3.34.58 4.5 1.75a6.12 6.12 0 0 1 1.74 4.5 9.3 9.3 0 0 1-.26 2.29 6.03 6.03 0 0 1-.84 1.85ZM12.46 10 9.59 7.14a2.24 2.24 0 0 1 .46-.17 2.02 2.02 0 0 1 2 .58 2.2 2.2 0 0 1 .41 2.45Zm-1.97 1.21c-.6 0-1.1-.2-1.52-.62a2.06 2.06 0 0 1-.62-1.51 2.27 2.27 0 0 1 .23-.99l2.9 2.9a2.27 2.27 0 0 1-1 .22Z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              <a href="tel:711" aria-label="7 1 1">For TTY, call <strong>711 then 988</strong></a>
            </p>
          </li>
        </ul>Get more resources at <a href="https://www.veteranscrisisline.net/">VeteransCrisisLine.net</a>.
      </div>
    </div>
  </div>
);

export default CrisisLineModal;