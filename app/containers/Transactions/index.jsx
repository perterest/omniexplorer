/**
 *
 * Transactions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Container } from 'reactstrap';
import styled from 'styled-components';
// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
import TransactionList from 'components/TransactionList';
import TransactionListHeader from 'components/TransactionListHeader';
import ListPagination from 'components/ListPagination';

import LoadingIndicator from 'components/LoadingIndicator';

import { makeSelectLoading, makeSelectTransactions } from './selectors';
// import reducer from './reducer';
// import saga from './saga';
import { loadTransactions, setPage } from './actions';

export class Transactions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const _pathname = this.props.location.get('pathname');
    const _page = _pathname.slice(_pathname.indexOf('/') + 1);
    
    this.props.loadTransactions(this.props.addr, _page);
    console.log('Transactions did mount');
  }
  
  render() {
    const StyledContainer = styled(Container)`
      background-color: #F0F3F4;
      overflow: auto;
    `;
    const StyledH3 = styled.h3`
      padding: 3rem 0;
    `;
    
    let content;
    
    if (this.props.loading) {
      content = (
        <LoadingIndicator />
      );
    } else if (!this.props.loading && (this.props.transactions.transactions || []).length === 0) {
      content = (
        <StyledH3 className="lead text-center">No transactions found</StyledH3>
      );
    } else {
      const props = { ...this.props.transactions, addr: this.props.addr };
      content = (
        <div>
          <ListPagination {...props} onSetPage={this.props.onSetPage}/>
          <TransactionList {...this.props.transactions} />
          <ListPagination {...props} onSetPage={this.props.onSetPage}/>
        </div>
      );
    }
    
    return (
      <StyledContainer fluid>
        <TransactionListHeader />
        { content }
      </StyledContainer>
    );
  }
}

Transactions.propTypes = {
  loadTransactions: PropTypes.func,
  transactions: PropTypes.object.isRequired,
  onSetPage: PropTypes.func,
  loading: PropTypes.bool,
  addr: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  transactions: makeSelectTransactions(),
  loading: makeSelectLoading(),
  location: (state) => state.get('route').get('location'),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadTransactions: (addr, page) => dispatch(loadTransactions(addr, page)),
    onSetPage: (p, addr) => dispatch(setPage(p, addr)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  // withReducer,
  // withSaga,
  withConnect,
)(Transactions);
