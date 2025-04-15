import './ShowModal.css';
import React from 'react';
import {Modal} from 'antd';

export function ShowModal(props: any): React.ReactElement {
    const {
        options = {},
        open = false,
        header,
        content,
        trigger,
    } = props;

    const {
        opacity = 0.5,
        onOpenEnd = null,
        inDuration = 250,
        onCloseEnd = null,
        outDuration = 250,
        onOpenStart = null,
        onCloseStart = null,
        preventScrolling = true,
    } = options;

    return (
        <>
            {trigger}
            <Modal
                footer={null}
                title={header}
                visible={open}
                style={{opacity}}
                onOk={onOpenEnd || onOpenStart}
                onCancel={onCloseEnd || onCloseStart}
                bodyStyle={{transitionDuration: `${inDuration}ms, ${outDuration}ms`}}
                maskStyle={{backgroundColor: preventScrolling ? 'rgba(0, 0, 0, 0.45)' : 'transparent'}}
            >
                {content}
            </Modal>
        </>
    );
}
