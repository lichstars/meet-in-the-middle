import React, { Component } from 'react';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-bootstrap';
import Friends from './components/Friends';
import FriendList from './components/FriendList';
import Activities from './components/Activities';
import { setupMap } from './services/google-maps';

const Map = styled.div`
  height: 800px;
`;

class App extends Component {
  componentDidMount() {
    setupMap('Melbourne, Australia');
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={ 12 } sm={ 6 }>
            Friends
            <Friends />
            <FriendList />
            <Activities />
          </Col>
          <Col xs={ 12 } sm={ 6 }>
            Map
            <Map id="map" />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
