import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { searchPlaces } from '../state/actions';

const Address = styled.div`
  font-size: 12px;
`;

const Place = styled.div`
  padding-bottom: 6px;
`;

const PlaceName = styled.a`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
`;

const SearchButton = styled(Button)`
  padding-bottom: 16px;
`;

class Places extends Component {
  search = () => {
    this.props.searchPlaces();
  }

  render () {
    return (
      <div>
        {
          this.props.locations.length > 2 &&
          <SearchButton onClick={ this.search }>Search for places</SearchButton>
        }
        {
          this.props.places && this.props.places.map((place, key) => {
            const address = place.details.address_components;

            return (
              <Place key={ key }>
                <PlaceName href={ place.details.website }> { place.details.name } ({ place.details.rating }) </PlaceName>
                <Address>{ address[0].short_name } { address[1].short_name } { address[2].short_name }</Address>
              </Place>
            );
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locations: state.app.locations,
  places: state.app.places,
});

const mapDispatchToProps = (dispatch) => ({
  searchPlaces: () => {
    dispatch(searchPlaces());
  },
});

const ConnectedPlaces = connect(mapStateToProps, mapDispatchToProps)(Places);

export default ConnectedPlaces;
