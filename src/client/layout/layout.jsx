import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import { FormattedMessage } from 'react-intl';
import ActionTypes from '../actionTypes';
import Header from './header.jsx';
import Footer from './footer.jsx';
import LayoutDrawer from './layoutDrawer.jsx';
import ShoppingCartPropType from '../shoppingcart/shoppingCart.proptypes';

const styles = {
  container: {
    paddingTop: '60px',
  },
  bodyContainer: {
    position: 'relative',
  },
  appBar: {
    position: 'fixed',
    top: 0,
  },
  title: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

const Layout = ({
  authService,
  loggedIn,
  drawerOpened,
  roles,
  logout,
  toggleDrawer,
  shoppingCart,
  shoppingCartNotification,
  hideShoppingCartNotification,
  children,
}) => (
  <div style={styles.container}>
    <Header toggleDrawer={toggleDrawer} shoppingCart={shoppingCart} />
    <LayoutDrawer
      roles={roles}
      logout={() => {
        authService.logout();
        logout();
      }}
      login={() => authService.login()}
      loggedIn={loggedIn}
      drawerOpened={drawerOpened}
      toggleDrawer={toggleDrawer}
    />
    <Paper style={styles.bodyContainer}>
      {children}
    </Paper>
    <Footer />
    <Snackbar
      open={shoppingCartNotification}
      message={
        <FormattedMessage id="NOTIFICATION.SHOPPING_CART_ITEM_ADDED" />
      }
      autoHideDuration={4000}
      onRequestClose={hideShoppingCartNotification}
    />
  </div>
);

Layout.propTypes = {
  logout: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  authService: PropTypes.shape({
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }),
  shoppingCart: ShoppingCartPropType,
  shoppingCartNotification: PropTypes.bool,
  hideShoppingCartNotification: PropTypes.func,
  children: PropTypes.element.isRequired,
};

export default connect(
  state => Object.assign({
    shoppingCart: state.shoppingCart,
  }, state.auth, state.layout),
  dispatch => ({
    logout() {
      dispatch({
        type: ActionTypes.LOGGED_OUT,
      });
    },
    toggleDrawer() {
      dispatch({
        type: ActionTypes.TOGGLE_DRAWER,
      });
    },
    hideShoppingCartNotification() {
      dispatch({
        type: ActionTypes.HIDE_SHOPPING_CART_NOTIFICATION,
      });
    },
  })
)(Layout);

