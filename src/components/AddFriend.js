import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button, FormControl } from 'react-bootstrap';
import { addFriend, addCurrentLocation } from '../state/actions';

const Container = styled.div`
  padding-bottom: 16px;
`;

class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      location: '',
    };
  }

  addMyLocation = () => {
    this.props.addCurrentLocation();
  }

  setName = (event) => {
    this.setState({ name: event.target.value });
  }

  setLocation = (event) => {
    this.setState({ location: event.target.value });
  }

  handleSubmit = () => {
    this.props.addFriend(this.state.name, this.state.location);
  }

  render () {
    return (
      <Container>
        <p><Button block onClick={ this.addMyLocation }>Add my location</Button></p>
        <p><FormControl type="text" onBlur={ this.setName } placeholder="Name" /></p>
        <p><FormControl type="text" onBlur={ this.setLocation } placeholder="Address" /></p>
        <Button block onClick={ this.handleSubmit }>Add friend</Button>
      </Container>
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

const ConnectedAddFriend = connect(null, mapDispatchToProps)(AddFriend);

export default ConnectedAddFriend;
