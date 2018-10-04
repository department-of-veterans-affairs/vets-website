import React from 'react';

const config = {
  messages: {
    VIC002: (
      <p>
        We're sorry. We're having trouble finding your records in our system
        right now. Please go to{' '}
        <a href="https://access.va.gov/accessva/">AccessVA</a> to request a
        Veteran ID Card.
      </p>
    ),
    VIC003:
      "We're sorry. We can't proceed with your request for a Veteran ID card because we can't confirm your eligibility right now. Please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).",
    VIC010:
      "We're sorry. We can't proceed with your request for a Veteran ID card because we can't confirm your military history right now. Please try again in a few minutes. If it still doesn't work, please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).",
    VIC011:
      "We're sorry. We can't proceed with your request for a Veteran ID card because we can't confirm your military history right now. Please try again in a few minutes. If it still doesn't work, please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).",
    default:
      "We're sorry, but something went wrong. Please try again in a few moments.",
    VICV5: (
      <p>
        We're sorry. Something went wrong on our end. We can't process your
        request right now. Please go to{' '}
        <a href="https://access.va.gov/accessva/">AccessVA</a> to request a
        Veteran ID Card.
      </p>
    ),
    VICV2: (
      <p>
        We’re sorry. We can’t confirm your eligibility for a Veteran ID card
        right now. To qualify for a Veteran ID Card, both of these must be true:
        <ul>
          <li>
            You served on active duty, in the military reserves, or in the
            National Guard, and{' '}
          </li>
          <li>
            You separated under honorable conditions or general (under honorable
            conditions)
          </li>
        </ul>
      </p>
    ),
    VICV4: (
      <p>
        We’re sorry. We can’t confirm your eligibility for a Veteran ID card
        right now. To qualify for a Veteran ID Card, both of these must be true:
        <ul>
          <li>
            You served on active duty, in the military reserves, or in the
            National Guard, and{' '}
          </li>
          <li>
            You separated under honorable conditions or general (under honorable
            conditions)
          </li>
        </ul>
      </p>
    ),
  },
};

export default config;
