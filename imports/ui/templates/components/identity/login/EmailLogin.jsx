import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import { Session } from 'meteor/session';

import { clearPopups } from '/imports/ui/modules/popup';
import Warning from '../../../widgets/warning/Warning.jsx';
import Signup from '../signup/Signup.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import SocialMediaLogin from './SocialMediaLogin.jsx';

export default class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginScreen: true,
      passwordKnown: true,
      incorrectUser: false,
    };

    this.handleLoginRender = this.handleLoginRender.bind(this);
    this.handleForgotPasswordRender = this.handleForgotPasswordRender.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSigninError = this.handleSigninError.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleLoginRender() {
    this.setState({ loginScreen: !(this.state.loginScreen) });
  }

  handleForgotPasswordRender() {
    // Session.set('cardNavigation', (this.state.passwordKnown));
    this.setState({ passwordKnown: !(this.state.passwordKnown) });
  }

  handleFocus() {
    this.setState({ incorrectUser: false });
  }

  handleSigninError() {
    this.setState({ incorrectUser: true });
  }

  handleSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('signin-email').value;
    const pass = document.getElementById('signin-password').value;

    Meteor.loginWithPassword(email, pass, (error) => {
      if (error) {
        switch (error.error) {
          case 400:
            // Blank email and/or password
            this.handleSigninError();
            break;
          case 403:
            // User not found or incorrect password
            this.handleSigninError();
            break;
        }
      } else {
        // Successful login
        clearPopups();
      }
    });
  }

  render() {
    const incorrectUserState = this.state.incorrectUser;
    const loginScreen = this.state.loginScreen;

    if (this.state.loginScreen === true) {
      if (this.state.passwordKnown === true) {
        return (
          <div>
            <div className="w-clearfix paper-header card-header">
              <div className="stage stage-finish-approved stage-card stage-anon button">
                <div className="label label-corner">
                  {TAPi18n.__('anonymous-mode')}
                </div>
              </div>
              <div className="card-title">
                {loginScreen ?
                  <img src="/images/fingerprint-white.png" className="section-icon" alt="lock" />
                :
                  <div id="card-back">
                    <img src="/images/back.png" className="section-icon section-icon-active" alt="lock" />
                  </div>
                }
                {TAPi18n.__('identity')}
              </div>
            </div>
            <div className="login">
              <div className="w-form">
                <form id="email-signin-form" name="email-form-3" data-name="Email Form 3" onSubmit={this.handleSubmit}>
                  <div className="w-clearfix login-field">
                    <label htmlFor="name" className="login-label login-label-form">{TAPi18n.__('email-username')}</label>
                    <img src="/images/mail-closed.png" className="login-icon" alt="mail-closed" />
                    <input id="signin-email" type="text" placeholder={TAPi18n.__('email-sample')} className="w-input login-input" onFocus={this.handleFocus} />
                  </div>
                  <div className="w-clearfix login-field">
                    <label htmlFor="name" className="login-label login-label-form">{TAPi18n.__('password')}</label>
                    <img src="/images/lock.png" className="login-icon" alt="lock" />
                    <input id="signin-password" type="password" placeholder={TAPi18n.__('password-sample')} className="w-input login-input" onFocus={this.handleFocus} />
                  </div>
                  {incorrectUserState ? <div className="extra section"> <Warning label="user-not-found" /> </div> : null}
                  <div className="popup-text">
                    <a id="signup" onClick={this.handleLoginRender}>{TAPi18n.__('sign-up')}</a> {TAPi18n.__('or')} <a id="forgot-pw" onClick={this.handleForgotPasswordRender}>{TAPi18n.__('recover-password')}</a>.
                  </div>
                  <div type="submit" id="signin-button" className="button login-button" onClick={this.handleSubmit}>
                    <div>{TAPi18n.__('sign-in')}</div>
                  </div>
                </form>
              </div>
              <SocialMediaLogin agoraMode={false} />
            </div>
          </div>
        );
      } else if (this.state.passwordKnown === false) {
        return (<ForgotPassword onClick={this.handleForgotPasswordRender} />);
      }
    } else if (this.state.loginScreen === false) {
      return (<Signup onClick={this.handleLoginRender} />);
    }
  }
}