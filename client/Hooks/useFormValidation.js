import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';



function useFormValidation({
  validations,
  initial,
}) {
  const [data, setData] = useState((initial || {}));
  const [errors, setErrors] = useState({});
  const { debounce } = useDebounce();

  const handleChange = (key, fn) => (value) => {
    delete errors[key];
    if (fn) {
      debounce(() => fn(value), 500);
    }
    setData({
      ...data,
      [key]: value,
    });
  };
  const validate = useCallback((validation, value) => {
    if (validation?.required?.value && !value) {
      return validation?.required?.message;
    }
    const pattern = validation?.pattern;
    if (pattern?.value && !pattern?.value.test(value)) {
      return pattern.message;
    }
    const custom = validation?.custom;
    if (custom?.isValid && !custom.isValid(value)) {
      return custom.message;
    }
    return null;
  }, []);

  const handleBlur = (key) => () => {
    const newErrors = { ...errors } || {};
    const value = data[key];
    const validation = validations[key];
    const errorContent = validate(validation, value);
    if (errorContent) {
      newErrors[key] = errorContent;
      setErrors(newErrors);
    }
    // if (!newErrors[key]) {
    //     const value = data[key];
    //     const validation = validations[key];
    //     delete newErrors[key];
    //     validate(validation, value);
    //   }
  };
  const handleSubmit = (fn) => {
    const newErrors = { ...errors } || {};
    for (const key in data) {
      const value = data[key];
      const validation = validations[key];
      const errorContent = validate(validation, value);
      if (errorContent) {
        newErrors[key] = errorContent;
        setErrors(newErrors);
      }
    }
    if (Object.keys(newErrors).length === 0) {
      fn();
    }
  };

  return { data, handleChange, errors, setErrors, handleSubmit, handleBlur };
}

export default useFormValidation;
