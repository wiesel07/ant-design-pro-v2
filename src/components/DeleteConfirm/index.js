import React, { Fragment } from 'react';
import { Popconfirm } from 'antd';

class DeleteConfirm extends React.Component {
    render() {
        const { method, params, dispatch,callback } = this.props;

        return (
            <Fragment>
                <Popconfirm
                    title="确定删除？"
                    onConfirm={(e) => {
                        debugger
                        dispatch({
                            type: method,
                            payload: { ...params },
                            callback:callback
                        });
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <a href="#" style={{ color: "red" }}>删除</a>
                </Popconfirm>
            </Fragment>
        );
    }

}

export default DeleteConfirm;
