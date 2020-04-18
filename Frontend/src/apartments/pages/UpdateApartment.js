import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ApartmentForm.css';

const UpdateApartment = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedApartment, setLoadedApartment] = useState();
  const apartmentId = useParams().apartmentId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/apartments/${apartmentId}`
        );
        setLoadedApartment(responseData.apartment);
        setFormData(
          {
            title: {
              value: responseData.apartment.title,
              isValid: true
            },
            threshold: {
              value: responseData.apartment.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchApartment();
  }, [sendRequest, apartmentId, setFormData]);

  const apartmentUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/apartments/${apartmentId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          threshold: formState.inputs.threshold.value
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      history.push('/' + auth.managerId + '/apartments');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedApartment && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find apartment!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedApartment && (
        <form className="apartment-form" onSubmit={apartmentUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedApartment.title}
            initialValid={true}
          />
          <Input
            id="threshold"
            element="textarea"
            label="Threshold Value"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid Threshold Value"
            onInput={inputHandler}
            initialValue={loadedApartment.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE APARTMENT
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateApartment;
