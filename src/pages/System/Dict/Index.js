import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Menu, Modal, Row, Col, Select, Button, Icon, Input, Popconfirm, message, Divider, } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import DeleteConfirm from '@/components/DeleteConfirm';
import BusTable from '@/components/BusTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const dictModelName = 'System.Dict';
import styles from './Dict.less';


// const CreateForm = Form.create()(props => {
//     const { modalVisible, form, handleAdd, handleModalVisible } = props;
//     const { getFieldDecorator } = form;
//     const okHandle = () => {
//         form.validateFields((err, fieldsValue) => {
//             if (err) return;
//             form.resetFields();
//             handleAdd(fieldsValue);
//         });
//     };

//     const formVals = {
//         status: "1",
//     }
//     const formItemLayout = {
//         labelCol: {
//             xs: { span: 24 },
//             sm: { span: 4 },
//         },
//         wrapperCol: {
//             xs: { span: 24 },
//             sm: { span: 20 },
//         },
//     };

//     return (
//         <Modal
//             destroyOnClose
//             title="新建字典"
//             visible={modalVisible}
//             onOk={okHandle}
//             onCancel={() => handleModalVisible()}
//         >
//             {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
//                 {form.getFieldDecorator('desc', {
//                     rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
//                 })(<Input placeholder="请输入" />)}
//             </FormItem> */}
//             <Form {...formItemLayout} >
//                 <FormItem label="字典名称" hasFeedback>
//                     {getFieldDecorator('dictName', {
//                         rules: [],
//                     })(<Input />)}
//                 </FormItem>
//                 <FormItem label="字典编码">
//                     {getFieldDecorator('dictCode', {
//                         rules: [
//                             {
//                                 max: 10,
//                                 message: '字典编码最大长度为10',
//                             },
//                             {
//                                 required: true,
//                                 message: '请输入字典编码',
//                             },
//                         ],
//                     })(<Input />)}
//                 </FormItem>,
//                 <FormItem key="status" label="状态">
//                     {form.getFieldDecorator('status', {
//                         initialValue: formVals.status,
//                         rules: [
//                             {
//                                 required: true,
//                                 message: '请选择状态',
//                             },
//                         ],
//                     })(
//                         <Select style={{ width: '100%' }}>
//                             <Option value="1">启用</Option>
//                             <Option value="0">停用</Option>
//                         </Select>
//                     )}
//                 </FormItem>,
//                 <FormItem label="备注">
//                     {getFieldDecorator('remark', {
//                         rules: [],
//                     })(
//                         <TextArea
//                             style={{ minHeight: 32 }}
//                             placeholder="请输入备注"
//                             rows={4}
//                         />
//                     )}
//                 </FormItem>
//             </Form>
//         </Modal>
//     );
// });

const actions = {
    ADD: "ADD",
    UPDATE: "UPDATE",
    VIEW: "VIEW",
}


@connect((state) => {
    return {
        gridData: state['System.Dict'].data,
        loading: state.loading.effects.fetch
    }
}
)
@Form.create()
class SystemDict extends React.Component {
    state = {
        modalVisible: false,
        selectedRows: [],
        formValues: {},
        done: false,
        action: '',
    };
    columns = [
        {
            title: '字典编码',
            dataIndex: 'dictCode',
        },
        {
            title: '字典名称',
            dataIndex: 'dictName',
        },
        {
            title: '操作',
            render: (text, record) => (

                <Fragment>
                    <a onClick={() => this.handleModalVisible(true, record)}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleModalVisible(true, record)}>详情</a>
                    <Divider type="vertical" />
                    <DeleteConfirm
                        method={`${dictModelName}/remove`}
                        params={{ 'id': record.dictId }}
                        dispatch={this.props.dispatch}
                        callback={this.refreshTable}
                    />
                </Fragment>

            ),
        },
    ];

    componentWillMount() {
        this.refreshTable();
    }

    refreshTable = () => {
        const { dispatch } = this.props;
        dispatch({
            type: `${dictModelName}/fetch`,
            payload: {
                pageNo: '1',
                pageSize: '10'
            }
        });
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };
    handleQuery = () => {
        console.log("handleQuery");
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        }); l
        dispatch({
            type: `${dictModelName}/fetch`,
            payload: {
                pageNo: '1',
                pageSize: '10'
            }
        });
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    showModal = (item, flag, action) => {
        this.setState({
            modalVisible: !!flag,
            current: item,
            action: action
        });
    };

    handleCancel = () => {
        //   setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
            modalVisible: false,
        });
    };

    handleDone = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
            done: false,
            modalVisible: false,
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
            type: `${dictModelName}/add`,
            payload: { ...fields },
        }).then(() => {
            message.success('添加成功');
            this.handleModalVisible();
        }).then(
            () => {
                this.refreshTable();
            }
        )
    };

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const { current, action } = this.state;
        const id = current ? current.id : '';

        //   setTimeout(() => this.addBtn.blur(), 0);
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: `${dictModelName}/add`,
                payload: { ...fieldsValue },
            }).then(() => {
                message.success(action == action.ADD ? '添加成功' : '修改成功');
                this.handleCancel();
            }).then(
                () => {
                    this.setState({
                        done: true,
                    });
                    this.refreshTable();
                }
            );
        });
    };

    handleMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        if (selectedRows.length === 0) return;
        switch (e.key) {
            case 'remove':
                // dispatch({
                //   type: 'rule/remove',
                //   payload: {
                //     key: selectedRows.map(row => row.key),
                //   },
                //   callback: () => {
                //     this.setState({
                //       selectedRows: [],
                //     });
                //   },
                // });
                break;
            default:
                break;
        }
    };


    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="申请日期">
                            {getFieldDecorator('billDate')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="管理模式">
                            {getFieldDecorator('patternTypeName')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit" onClick={this.handleQuery}>
                                查询
              </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
              </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    };


    getModalContent() {
        const { form } = this.props;
        const { getFieldDecorator } = form
        const { done } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        if (done) {
            return (
                <Result
                    type="success"
                    title="操作成功"
                    //  description="一系列的信息描述，很短同样也可以带标点。"
                    actions={
                        <Button type="primary" onClick={this.handleDone}>
                            确定
                </Button>
                    }
                />
            );
        }
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} >
                <FormItem label="字典名称" hasFeedback>
                    {getFieldDecorator('dictName', {
                        rules: [],
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="字典编码">
                    {getFieldDecorator('dictCode', {
                        rules: [
                            {
                                max: 10,
                                message: '字典编码最大长度为10',
                            },
                            {
                                required: true,
                                message: '请输入字典编码',
                            },
                        ],
                    })(<Input placeholder="请输入" />)}
                </FormItem>,
                <FormItem key="status" label="状态">
                    {form.getFieldDecorator('status', {
                        //initialValue: formVals.status,
                        rules: [
                            {
                                required: true,
                                message: '请选择状态',
                            },
                        ],
                    })(
                        <Select style={{ width: '100%' }}>
                            <Option value="1">启用</Option>
                            <Option value="0">停用</Option>
                        </Select>
                    )}
                </FormItem>,
                <FormItem label="备注">
                    {getFieldDecorator('remark', {
                        rules: [],
                    })(
                        <TextArea
                            style={{ minHeight: 32 }}
                            placeholder="请输入"
                            rows={4}
                        />
                    )}
                </FormItem>
            </Form>
        );
    };

    render() {
        const {
            gridData,
            loading,
        } = this.props;

        //将数据拼接成StandardTable组件需要的格式
        const { selectedRows, modalVisible, done } = this.state;
debugger
        const modalFooter = done
            ? { footer: null, onCancel: this.handleDone }
            : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
            </Menu>
        );
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        // const formItem={
        //     retrun (
        //     <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        //     {form.getFieldDecorator('desc', {
        //       rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        //     })(<Input placeholder="请输入" />)}
        //   </FormItem>)
        // }

        return (

            <PageHeaderWrapper title="字典管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.showModal({}, true, actions.ADD)}>
                                新建
                           </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Button>批量操作</Button>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            更多操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>
                        <StandardTable
                            bordered={true}
                            loading={loading}
                            selectedRows={selectedRows}
                            columns={this.columns}
                            rowKey={'dictId'}
                            data={gridData}
                            onSelectRow={this.handleSelectRows}
                        />
                    </div>
                </Card>

             

                {/* <CreateForm {...parentMethods} modalVisible={modalVisible} /> */}
            </PageHeaderWrapper>
        );
    }
}

export default SystemDict;
