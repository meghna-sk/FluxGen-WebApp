import React from 'react';

import ManagerItem from './ManagerItem';
import Card from '../../shared/components/UIElements/Card';
import './ManagersList.css';

const ManagersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No managers found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="managers-list">
      {props.items.map(manager => (
        <ManagerItem
          key={manager.id}
          id={manager.id}
          //image={user.image}
          name={manager.name}
          apartmentCount={manager.apartments.length}
        />
      ))}
    </ul>
  );
};

export default ManagersList;
