import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Row, Col, Select, Button, Icon, Input, Popconfirm } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DeleteConfirm from '@/components/DeleteConfirm';


const FormItem = Form.Item;
const { Option } = Select;
const roleModelName = 'System.Role';
import styles from './Role.less';

@connect((state) => {

    return {
        gridData: state['System.Role'].gridData,
        loading: state.loading.effects.fetch
    }
}
)
@Form.create()
class UpmsRole extends React.Component {
    state = {
        selectedRows: [],
        formValues: {},
    };
    columns = [
        {
            title: '角色编码',
            dataIndex: 'roleCode',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '状态',
            dataIndex: 'status',
        },
        {
            title: '操作',
            render: (text, record) => (
                <DeleteConfirm
                    method={`${roleModelName}/remove`}
                    params={{ 'id': record.roleId }}
                    dispatch={this.props.dispatch}
                    callback={this.refreshTable}
                />
            ),
        },
    ];

    componentWillMount() {
      this.refreshTable();
    }

    refreshTable = () => {
        const { dispatch } = this.props;
        dispatch({
            type: `${roleModelName}/fetch`,
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
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        }); l
        dispatch({
            type: `${roleModelName}/fetch`,
            payload: {
                pageNo: '1',
                pageSize: '10'
            }
        });
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
                            <Button type="primary" htmlType="submit">
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
    }

    render() {
        const {
            gridData,
            loading,
        } = this.props;

        //将数据拼接成StandardTable组件需要的格式
        let data = [];

        debugger
        //data.list = gridData.rows;
        data.list = {};


        data.pagination = {
            current: gridData.current,
            pageSize: gridData.size,
            total: gridData.total
        };

        const { selectedRows } = this.state;
        return (
            <PageHeaderWrapper title="角色管理">
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                    <StandardTable
                        loading={loading}
                        selectedRows={selectedRows}
                        columns={this.columns}
                        rowKey={'roleId'}
                        data={data}
                        onSelectRow={this.handleSelectRows}
                    />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default UpmsRole;
