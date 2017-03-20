import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import { FormattedMessage } from 'react-intl';
import { initialize } from 'redux-form';
import { ShoppingCartPropType } from '../shoppingcart/shoppingCart.proptypes';
import ActionTypes from '../actionTypes';
import AddressChooser from './addressChooser.jsx';
import UserAddress, { formName } from './userAddress.jsx';
import Payment from './payment.jsx';
import Xhr from '../xhr';
import OrderPropType from './order.proptypes';

const styles = {
  container: {
    padding: '24px',
  },
  productAvatar: {
    margin: '10px 0',
  },
  footerRow: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  deleteButton: {
    marginRight: '8px',
  },
  itemsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '8px',
  },
};

class OrderStepper extends React.Component {
  componentWillMount() {
    this.props.loadAddresses();
  }

  render() {
    const {
      email,
      shoppingCart,
      finishOrder,
      selectAddress,
      saveAddress,
      order,
    } = this.props;

    return (
      <div style={styles.container}>
        <Stepper
          activeStep={order.step}
          linear={false}
          orientation="vertical"
        >
          <Step>
            <StepButton>
              <FormattedMessage id="ORDER.ADDRESS.TITLE" />
            </StepButton>
            <StepContent>
              <AddressChooser
                addresses={order.addresses}
                selectedAddressId={order.selectedAddress && order.selectedAddress._id}
                selectAddress={
                  addressId => selectAddress(order.addresses
                    .find(address => address._id === addressId)
                  )
                }
              />
              <UserAddress onSubmit={saveAddress} />
            </StepContent>
          </Step>
          <Step>
            <StepButton>
              <FormattedMessage id="ORDER.PAYMENT.TITLE" />
            </StepButton>
            <StepContent>
              {email && <Payment
                email={email}
                shoppingCart={shoppingCart}
                finishOrder={finishOrder}
              />}
            </StepContent>
          </Step>
          <Step>
            <StepButton>
              <FormattedMessage id="ORDER.CONFIRMATION.TITLE" />
            </StepButton>
            <StepContent>
              <p>Bestätigung</p>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}

OrderStepper.defaultProps = {
  email: '',
};

OrderStepper.propTypes = {
  email: PropTypes.string,
  shoppingCart: ShoppingCartPropType.isRequired,
  finishOrder: PropTypes.func.isRequired,
  loadAddresses: PropTypes.func.isRequired,
  selectAddress: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
  order: OrderPropType.isRequired,
};

export default connect(
  state => ({
    email: state.auth.email,
    shoppingCart: state.shoppingCart,
    order: state.order,
  }),
  dispatch => ({
    loadAddresses: () => Xhr.get('/api/userAddresses')
      .then(addresses => dispatch({
        type: ActionTypes.ADDRESSES_LOADED,
        data: addresses,
      })),
    selectAddress: (address) => {
      dispatch({
        type: ActionTypes.SELECT_ADDRESS,
        data: address,
      });
      dispatch(initialize(formName, address));
    },
    saveAddress: (address) => {
      if (address._id) {
        dispatch({
          type: ActionTypes.SAVE_ADDRESS,
          data: address._id,
        });
      } else {
        Xhr.post(
          '/api/userAddress',
          address,
          'application/json'
        )
          .then(addressId => dispatch({
            type: ActionTypes.SAVE_ADDRESS,
            data: addressId,
          }));
      }
    },
    finishOrder: () => dispatch({
      type: ActionTypes.ORDER_FINISHED,
    }),
  })
)(OrderStepper);
