export function createForm(path, params, method) {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;
  form.target = '_blank';

  Object.entries(params).forEach(([key, value]) => {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = key;
    hiddenField.value = value;

    form.appendChild(hiddenField);
  });

  return form;
}

export default function submitForm(path, params, method = 'post') {
  const form = createForm(path, params, method);

  document.body.appendChild(form);
  form.submit();
  form.remove();
}
