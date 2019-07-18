import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Card,
  Form,
  Menu,
  Modal,
  Row,
  Col,
  Select,
  Button,
  Icon,
  Input,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import DeleteConfirm from '@/components/DeleteConfirm';
import BusTable from '@/components/BusTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const modelName = 'System.Dict';
import styles from './Dict.less';

const actions = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  VIEW: 'VIEW',
};

@connect(state => {
  return {
    pageData: state[modelName].pageData,
    loading: state.loading.models[modelName],
  };
})
@Form.create()
class SystemDict extends React.Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
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
          {/* <a onClick={() => this.handleModalVisible(true, record)}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleModalVisible(true, record)}>详情</a>
                    <Divider type="vertical" /> */}
          <DeleteConfirm
            method={`${modelName}/remove`}
            params={{ id: record.dictId }}
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
      type: `${modelName}/queryPage`,
      payload: {
        pageNo: '1',
        pageSize: '10',
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  handleQuery = () => {
    console.log('handleQuery');
  };

  showModal = () => {};

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
  }

  render() {
    const { pageData, loading } = this.props;

    //将数据拼接成StandardTable组件需要的格式
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="字典管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.showModal({}, true, actions.ADD)}
              >
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
      </PageHeaderWrapper>
    );
  }
}

export default SystemDict;
