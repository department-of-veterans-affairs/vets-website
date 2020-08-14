// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');
