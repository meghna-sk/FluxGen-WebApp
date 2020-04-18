import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ApartmentItem from './ApartmentItem';
import Button from '../../shared/components/FormElements/Button';
import './ApartmentList.css';

const ApartmentList = props => {
  if (props.items.length === 0) {
    return (
      <div className="apartment-list center">
        <Card>
          <h2>No apartments found. Maybe create one?</h2>
          <Button to="/apartments/new">Share Apartment</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="apartment-list">
      {props.items.map(apartment => (
        <ApartmentItem
          key={apartment.id}
          id={apartment.id}
          //image={place.image}
          title={apartment.title}
          //description={place.description}
          //address={place.address}
          manager_id={apartment.manager_id}
          //coordinates={place.location}
          onDelete={props.onDeleteApartment}
        />
      ))}
    </ul>
  );
};

export default ApartmentList;
