import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Button.scss';

const Button = ({ children, onClick, className, disabled, ...attrs }) => {
    const onClickAction = e => {
        if (disabled) {
            e.preventDefault();
        } else {
            return onClick(e);
        }
    };

    const classes = classNames(
        'btn',
        className,
    );

    const Tag = attrs.href ? 'a' : 'button';

    return (
        <Tag
            className={classes}
            disabled={disabled}
            onClick={onClickAction}
            {...attrs}
        >
            {children}
        </Tag>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

Button.defaultProps = {
    children: 'Default button',
    onClick: () => { },
    className: '',
    disabled: false,
};

export default Button;