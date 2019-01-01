import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import {   Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import {  AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />

        <AppSidebarToggler className="d-md-down-none" display="lg" />

          <AppNavbarBrand
            full={{ src: logo, width: 89, height: 25, alt: 'MTS' }}
            minimized={{ src: sygnet, width: 30, height: 30, alt: 'MTS' }}
          />

        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
          </NavItem>
          <NavItem className="d-md-down-none">
          </NavItem>
          <NavItem className="d-md-down-none">
          </NavItem>

        </Nav>
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
