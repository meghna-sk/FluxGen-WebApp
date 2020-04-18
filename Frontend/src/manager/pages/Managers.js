import React, { useEffect, useState } from 'react';

import ManagersList from '../components/ManagersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Managers = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedManagers, setLoadedManagers] = useState();

  useEffect(() => {
    const fetchManagers= async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/managers'
        );

        setLoadedManagers(responseData.managers);
      } catch (err) {}
    };
    fetchManagers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedManagers && <ManagersList items={loadedManagers} />}
    </React.Fragment>
  );
};

export default Managers;
