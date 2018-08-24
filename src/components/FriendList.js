import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { zoomToMidpoint, zoomToLocation, removeAndRecalculate } from '../state/actions';

const Name = styled.div`
  text-transform: uppercase;
  font-weight: 600;
  line-height: 14px;

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Address = styled.div`
  color: #555;
  font-size: 12px;
  line-height: 12px;
`;

const Location = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
`;

const Container = styled.div`
  padding-bottom: 16px;
`;

const DeleteUser = styled.div`
  cursor: pointer;
  font-size: 12px;
`;

class FriendList extends Component {
  render () {
    const { locations, zoomToMidpoint, removeLocation } = this.props;
    return (
      <Container>
        {
          locations && locations.map((location, key) => {
            const zoomFn = location.name === 'MIDPOINT' ? zoomToMidpoint : () => zoomToLocation(location);
            return (
              <Location key={ key }>
                <div>
                  <Name onClick={ zoomFn }>{ location.name }</Name>
                  <Address>{ location.address }</Address>
                </div>
                <DeleteUser onClick={ () => removeLocation(location) }>Remove</DeleteUser>
              </Location>
            );
          })
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  locations: state.app.locations,
});

const mapDispatchToProps = (dispatch) => ({
  zoomToMidpoint: () => {
    dispatch(zoomToMidpoint());
  },
  removeLocation: (location) => {
    dispatch(removeAndRecalculate(location));
  },
});

const ConnectedFriendList = connect(mapStateToProps, mapDispatchToProps)(FriendList);

export default ConnectedFriendList;
