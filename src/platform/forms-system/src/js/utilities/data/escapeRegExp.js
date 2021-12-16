const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default escapeRegExp;
