import { Upload, message, Button, Icon } from 'antd';

import React, { Fragment } from 'react';
import { Popconfirm } from 'antd';

class UploadFile extends React.Component {

    constructor(props) {
        super(props);
        this.params = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
 
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
    }

    render() {
        const {  test } = this.props;
console.log(test+"测试")
const pro= this.params;
        return (
            <Upload {...pro}>
                <Button>
                    <Icon type="upload" /> Click to Upload
        </Button>
            </Upload>
        );
    }

}

export default UploadFile;