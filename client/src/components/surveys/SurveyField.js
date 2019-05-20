//SurveyField contains logic to render a single label and text input

import React from 'react';

export default ({ input, label }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} />
    </div>
  );
};

//JSX explanation: within props, there is an input key (that contains a number of functions, etc). This is destructured from props in the function call and spread into the input tag (thus, input now has access to all of those functions (onBlur, onChange, etc))

//custom props can be entered into the corresponding Field tag in the parent component. For example, here label is a custom property that was defined in the Field tag and passed down to SurveyField (to be destructured from props and used as seen here)
