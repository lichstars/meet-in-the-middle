import store from './store';

describe('Store', () => {

  it('defines a valid store', () => {
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
  });

});
