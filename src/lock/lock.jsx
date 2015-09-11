import React from 'react/addons';
import { Map } from 'immutable';
import MultisizeSlide from '../multisize-slide/multisize_slide';
import Avatar from './avatar';
import IconButton from '../icon/button';
import Badge from './auth0_badge';
import * as l from './index';
import * as g from '../gravatar/index';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import { closeLock } from './actions';
import EscKeydownUtils from '../utils/esc_keydown_utils';

export default class Lock extends React.Component {
  componentDidMount() {
    this.escKeydown = new EscKeydownUtils(() => this.handleClose());
  }

  componentWillUnmount() {
    this.escKeydown.release();
  }

  render() {
    const { children, closeHandler, lock, submitHandler, disallowClose } = this.props;

    const overlay = l.ui.appendContainer(lock) ?
      <div className="auth0-lock-overlay"/> : null;

    const gravatar = l.gravatar(lock);
    const showCloseButton = l.ui.closable(lock) && !disallowClose;

    let className = "auth0-lock";
    if (!l.ui.appendContainer(lock)) {
      className += " auth0-lock-opened-in-frame";
    } else if (lock.get("show")) {
      className += " auth0-lock-opened";
    }

    if (l.submitting(lock)) {
      className += " auth0-lock-mode-loading";
    }

    return (
      <div className={className} ref="lock">
        {overlay}
        <div className="auth0-lock-center">
          <form className="auth0-lock-widget" onSubmit={::this.handleSubmit}>
            {gravatar && <Avatar imageUrl={g.imageUrl(gravatar)} />}
            {showCloseButton && <IconButton name="close" onClick={::this.handleClose} />}
            <div className="auth0-lock-widget-container">
              <MultisizeSlide delay={1000} transitionName="horizontal-fade">{children}</MultisizeSlide>
            </div>
            <span className="auth0-lock-badge-bottom">
              <Badge />
            </span>
          </form>
        </div>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const { lock, submitHandler } = this.props;
    if (submitHandler) {
      submitHandler(lock);
    }
  }

  handleClose() {
    const { closeHandler, lock } = this.props;
    closeHandler(l.id(lock));
  }
}

// TODO: complete, add defaults (disallowClose: false)
Lock.propTypes = {
  lock: React.PropTypes.object.isRequired
};