import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import {
  addFriend,
  addCurrentLocation,
} from '../state/actions';

class Friends extends Component {
  addMyLocation = () => {
    this.props.addCurrentLocation();
  }

  addFriends = () => {
    this.props.addFriend('John', 'Cooper Street, Essendon');
    this.props.addFriend('Mary', 'Caroline Springs');
  }

  addOneMore = () => {
    this.props.addFriend('Jack', 'Kinglake');
  }

  testTwoCountries = () => {
    this.props.addFriend('Jack', 'Australia');
    this.props.addFriend('Jack', 'India');
  }

  render () {
    return (
      <div>
        <Button onClick={ this.addMyLocation }>Add my location</Button>
        <Button onClick={ this.addFriends }>Add two friends</Button>
        <Button onClick={ this.addOneMore }>Add another friend</Button>
        <Button onClick={ this.testTwoCountries }>Test two countries</Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addFriend: (name, address) => {
    dispatch(addFriend(name, address));
  },
  addCurrentLocation: () => {
    dispatch(addCurrentLocation());
  },
});

const ConnectedFriends = connect(null, mapDispatchToProps)(Friends);

export default ConnectedFriends;
