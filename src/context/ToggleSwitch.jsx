import React from 'react';
import styled from 'styled-components';

const ToggleSwitchContainer = styled.label`
    position: relative;
    display: inline-block;
    width: 75px;
    height: 25px;
`;

const ToggleSwitchInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
        background-position: 0 0, 35px 0;
        padding-left: 25px;
        padding-right: 0;
    }

    &:checked + span:after {
        left: 38px;
    }
`;

const ToggleSwitchSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    background-image: -webkit-linear-gradient(
        hsla(0, 0%, 0%, 0.1),
        hsla(0, 0%, 100%, 0.1)
    ),
    -webkit-linear-gradient(left, #f66 50%, #6cf 50%);
    background-size: 100% 100%, 200% 100%;
    background-position: 0 0, 15px 0;
    border-radius: 25px;
    box-shadow: inset 0 1px 4px hsla(0, 0%, 0%, 0.5),
    inset 0 0 10px hsla(0, 0%, 0%, 0.5), 0 0 0 1px hsla(0, 0%, 0%, 0.1),
    0 -1px 2px 2px hsla(0, 0%, 0%, 0.25),
    0 2px 2px 2px hsla(0, 0%, 100%, 0.75);
    -webkit-transition: 0.25s;
    transition: 0.25s;

    &:after {
        background-color: #eee;
        background-image: -webkit-linear-gradient(hsla(0,0%,100%,.1), hsla(0,0%,0%,.1));
        border-radius: 25px;
        box-shadow: inset 0 1px 1px 1px hsla(0,0%,100%,1),
                inset 0 -1px 1px 1px hsla(0,0%,0%,.25),
                0 1px 3px 1px hsla(0,0%,0%,.5),
                0 0 2px hsla(0,0%,0%,.25);
        content: '';
        display: block;
        height: 25px;
        width: 50px;
    }
`;

const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <ToggleSwitchContainer>
            <ToggleSwitchInput type="checkbox" checked={checked} onChange={onChange} />
            <ToggleSwitchSlider />
        </ToggleSwitchContainer>
    );
};

export default ToggleSwitch;