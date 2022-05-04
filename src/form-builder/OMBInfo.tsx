import React from 'react';
import { OMBInfoProps } from './types';

/**
 * OMBInfo component is a simple form building component that displays the
 * VA OMB number from your form, expDate, and resBurden.
 *
 * @param {OMBInfoProps} props
 * 
 * @example
 * Here's a simple example:
 * ```typescript
 * <OMBInfo ombNumber="123-ABC" expDate="01/01/1001" resBurden={1} />
 * ```
 * 
 * @returns React.Component
 */
const OMBInfo = (props: OMBInfoProps): JSX.Element => {
  const { resBurden, ombNumber, expDate } = props;

  return (
    <div className="omb-info">
      {resBurden && (
        <div>
          Respondent burden: <strong>{resBurden} minutes</strong>
        </div>
      )}
      {ombNumber && (
        <div>
          OMB Control #: <strong>{ombNumber}</strong>
        </div>
      )}
      <div>
        Expiration date: <strong>{expDate}</strong>
      </div>
    </div>
  );
};

export default OMBInfo;
