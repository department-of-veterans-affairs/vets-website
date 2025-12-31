import {
  ContactMethodConfirm,
  ContactMethodSelect,
  validate,
} from './ContactMethodSelect';

export default [
  {
    name: 'contact-method',
    component: ContactMethodSelect,
    validate,
    back: null,
    next: 'contact-method-confirm',
  },
  {
    name: 'contact-method-confirm',
    component: ContactMethodConfirm,
    next: null,
    back: 'contact-method',
  },
];
