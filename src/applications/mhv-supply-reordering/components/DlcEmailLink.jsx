import React from 'react';
import { DLC_EMAIL } from '../constants';

const DlcEmailLink = () => <a href={`mailto:${DLC_EMAIL}`}>{DLC_EMAIL}</a>;

export default DlcEmailLink;
