import React from 'react';
import { VASS_PHONE_NUMBER } from '../utils/constants';

export default function NeedHelp() {
  return (
    <div
      data-testid="help-footer"
      className="vaos-hide-for-print vads-u-margin-top--9 vads-u-margin-bottom--3"
    >
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Need help?
      </h2>
      <hr
        aria-hidden="true"
        className="vads-u-margin-y--1p5 vads-u-border-color--primary"
      />
      <p>
        <span className="vads-u-margin-top--0 vads-u-font-weight--bold">
          If you need to get in touch with VA Solid Start,{' '}
          <span className="vads-u-font-weight--normal">
            give us a call at{' '}
            <va-telephone
              contact={VASS_PHONE_NUMBER}
              data-testid="solid-start-telephone"
            />
            or visit{' '}
            <a href="https://benefits.va.gov/benefits/solid-start.asp?trk=public_post_comment-text">
              VA Solid Start
            </a>{' '}
            for more information.
          </span>
        </span>
      </p>
      <p>
        <span className="vads-u-margin-top--0 vads-u-font-weight--bold">
          If you’re in crisis or having thoughts of suicide,{' '}
          <span className="vads-u-font-weight--normal">
            call the Veterans Crisis Line at{' '}
            <va-telephone
              contact="988"
              data-testid="veterans-crisis-line-telephone"
            />
            {'. '}
            Then select 1. Or text{' '}
            <va-telephone
              contact="838255"
              data-testid="veterans-crisis-line-text-telephone"
            />
            . We offer confidential support anytime, day or night.
          </span>
        </span>
      </p>
      <p>
        <span className="vads-u-margin-top--0 vads-u-font-weight--bold">
          If you think your life or health is in danger,{' '}
          <span className="vads-u-font-weight--normal">
            call{' '}
            <va-telephone contact="911" data-testid="emergency-telephone" /> or
            go to the nearest emergency room.
          </span>
        </span>
      </p>
    </div>
  );
}
