import React, { Component } from 'react';
import styled from 'styled-components';
import AddFriend from './components/AddFriend';
import FriendList from './components/FriendList';
import Places from './components/Places';
import { setupMap } from './services/google-maps';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const SidePanel = styled.div`
  padding: 16px 8px;
  background: rgba(255,255,255,0.5);
  min-width: 400px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Map = styled.div`
  height: -webkit-fill-available;
`;

class App extends Component {
  componentDidMount() {
    setupMap('Melbourne, Australia');
  }

  render() {
    return (
      <Container>
        <SidePanel>
          <AddFriend />
          <FriendList />
          <Places />
        </SidePanel>
        <MapContainer>
          <Map id="map" />
        </MapContainer>
      </Container>
    );
  }
}

export default App;
