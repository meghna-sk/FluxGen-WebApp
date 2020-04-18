import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE
  
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ApartmentForm.css';

const NewApartment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      threshold: {
        value: Number,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const apartmentSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        'http://localhost:5000/api/apartments',
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          manager_id: auth.managerId,
          threshold: formState.inputs.threshold.value
        }),
        { 'Content-Type': 'application/json' }
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="apartment-form" onSubmit={apartmentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="threshold"
          element="input"
          label="Threshold Value"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Threshold Value."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD APARTMENT
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewApartment;
