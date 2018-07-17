import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";

import { modalClose } from "../../reducers/modal";
import { initiateLink, sendMkrToProxy } from "../../reducers/proxy";
import { sendVote } from "../../reducers/vote";
import ProxySetup from "./PoxySetup";
import Vote from "./Vote";
import close from "../../imgs/close.svg";

import { colors, transitions } from "../../theme";

const Column = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
`;

const StyledLightbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: ${transitions.base};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? "visible" : "hidden")};
  pointer-events: ${({ modal }) => (modal ? "auto" : "none")};
  background: rgba(${colors.dark}, 0.2);
`;

const StyledHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding: 15px;
`;

const StyledClose = styled.div`
  height: 36px;
  width: 36px;
  margin-left: auto;
  margin-top: -8px;
  margin-bottom: 8px;
  cursor: pointer;
  visibility: ${({ modal }) => (modal ? "visible" : "hidden")};
  background: url(${close}) no-repeat;
`;

const ModalTopper = styled.div`
  width: 600px;
`;

class Modal extends Component {
  modalController = () => {
    switch (this.props.modal) {
      case "PROXY_SETUP":
        window.scrollTo(50, 50);
        return <ProxySetup {...this.props} />;
      case "VOTE":
        return <Vote {...this.props} />;
      default:
        return <div />;
    }
  };

  render() {
    const body = document.body || document.getElementsByTagName("body")[0];

    if (this.props.modal) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return (
      <StyledLightbox modal={this.props.modal}>
        <StyledContainer>
          <StyledHitbox onClick={this.props.modalClose} />
          <Column maxWidth={600} center>
            <ModalTopper>
              <StyledClose
                modal={this.props.modal}
                onClick={this.props.modalClose}
              />
            </ModalTopper>
            {this.modalController()}
          </Column>
        </StyledContainer>
      </StyledLightbox>
    );
  }
}

Modal.propTypes = {};

const reduxProps = ({ modal, metamask, vote }) => ({
  modal: modal.modal,
  modalProps: modal.modalProps,
  account: metamask.accountAddress,
  network: metamask.network === "kovan" ? "kovan" : "mainnet",
  voteTxHash: vote.txHash
});

export default connect(
  reduxProps,
  { modalClose, initiateLink, sendMkrToProxy, sendVote }
)(Modal);