import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ApartmentList from '../components/ApartmentList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const ManagerApartments = () => {
  const [loadedApartments, setLoadedApartments] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const managerId = useParams().managerId;

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/apartments/manager/${managerId}`
        );
        setLoadedApartments(responseData.apartments);
      } catch (err) {}
    };
    fetchApartments();
  }, [sendRequest, managerId]);

  const apartmentDeletedHandler = deletedApartmentId => {
    setLoadedApartments(prevApartments =>
      prevApartments.filter(apartment => apartment.id !== deletedApartmentId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedApartments && (
        <ApartmentList items={loadedApartments} onDeleteApartment={apartmentDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default ManagerApartments;
