import React from 'react';
import { Link } from 'react-router-dom';

//import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './ManagerItem.css';

const ManagerItem = props => {
  return (
    <li className="manager-item">
      <Card className="manager-item__content">
        <Link to={`/${props.id}/apartments`}>
          <div className="manager-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.apartmentCount} {props.apartmentCount === 1 ? 'Apartment' : 'Apartments'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default ManagerItem;
