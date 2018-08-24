import React, { Component } from 'react';
import { connect } from 'react-redux';

class FriendList extends Component {
  render () {
    const { locations } = this.props;
    return (
      <div>
        {
          locations && locations.map((location, key) => (
            <div key={ key }>
              { location.name } : { location.address }
            </div>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locations: state.app.locations,
});

const ConnectedFriendList = connect(mapStateToProps)(FriendList);

export default ConnectedFriendList;
