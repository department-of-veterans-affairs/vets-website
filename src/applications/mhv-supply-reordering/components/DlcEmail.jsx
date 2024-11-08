import React from 'react';
import { DLC_EMAIL } from '../constants';

const DlcEmail = () => <a href={`mailto:${DLC_EMAIL}`}>{DLC_EMAIL}</a>;

export default DlcEmail;
