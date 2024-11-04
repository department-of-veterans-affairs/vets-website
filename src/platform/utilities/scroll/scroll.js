export const get = (name, root = document) =>
  root.querySelector(name) ||
  root.getElementById(name) ||
  root.getElementsByName(name)[0] ||
  root.getElementsByClassName(name)[0];

export const scrollTo = (name, options) => {
  let el = name;
  if (typeof name === 'string') {
    el = get(name);
  }
  if (el) {

  }
};
