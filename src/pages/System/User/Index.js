import React, { PureComponent, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
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
  Dropdown,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import DeleteConfirm from '@/components/DeleteConfirm';
import BusTable from '@/components/BusTable';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const modelName = 'System.User';
import styles from './User.less';

// const actions = {
//     ADD: "ADD",
//     UPDATE: "UPDATE",
//     VIEW: "VIEW",
// }
const status = {
  '1': '正常',
  '2': '锁定',
  '3': '停用',
  '4': '注销',
};


const SearchForm = Form.create()(props => {
  const { refreshTable, form } = props;
  const { getFieldDecorator } = form;

  const handleSearch = () => {

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
      };
      // 表格刷新
      refreshTable(values);
    });
  };

  const handleFormReset = () => {
    // const { form, dispatch } = this.props;
    form.resetFields();
    // 表格刷新
    refreshTable();
  };
  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="用户编码">
            {getFieldDecorator('userCode')(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="状态">
            {getFieldDecorator('status')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="1">正常</Option>
                <Option value="2">锁定</Option>
                <Option value="3">停用</Option>
                <Option value="9">注销</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});


@connect(state => {
  return {
    pageData: state[modelName].pageData,
    initDetailData: state[modelName].initDetailData,
    loading: state.loading.models[modelName],
  };
})
@Form.create()
class SystemUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      modalDone: false,
      modalVisible: false,
      formValues: {},
      current: undefined,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    this.columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'xh',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        render: (text, record) => {
          return text;
        }
      },
      {
        title: '用户编码',
        dataIndex: 'userCode',
        // width: 300,
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
      },
      {
        title: '手机号码',
        dataIndex: 'mobileNo',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return status[text];
        },
      },
      {
        title: '操作',
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={e => {
              e.preventDefault();
              this.showEditModal(record)
            }
            }>编辑</a>
            <Divider type="vertical" />
            {/* <a onClick={() => this.handleModalVisible(true, record)}>详情</a>
          <Divider type="vertical" /> */}
            <DeleteConfirm
              method={`${modelName}/remove`}
              params={{ id: record.userId }}
              dispatch={this.props.dispatch}
              callback={this.refreshTable}
            />
          </Fragment>
        ),
      },
    ];
  }

  componentWillMount() {
    this.refreshTable();
  }


  // 表格数据刷新
  refreshTable = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelName}/queryPage`,
      payload: { ...params },
    });
  };

  //  表格数据变化监听事件
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: `${modelName}/queryPage`,
      payload: params,
    });
  };

  // 模态框显隐
  showModal = () => {
    this.setState({
      modalVisible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelName}/detail`,
      payload: { id: item.userId },
    }).then(() => {
      this.setState({
        modalVisible: true,
        current: item,
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 模态框相应操作
  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      modalDone: false,
      modalVisible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      modalVisible: false,
    });
  };

  handleSubmit = e => {

    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    //const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // current无数据则为新增，否则为编辑
      let dispatchType = `${modelName}/add`;
      if (current) {
        dispatchType = `${modelName}/update`;
      }
      dispatch({
        type: dispatchType,
        payload: { ...current, ...fieldsValue },
      }).then(() => {
        this.setState({
          modalDone: true,
        })
        this.refreshTable();
      });
    });
  };

  getModalContent = (modalDone, initDetailData) => {
    const { form, form: { getFieldDecorator }, } = this.props;
    if (modalDone) {
      return (
        <Result
          type="success"
          title="操作成功"
          description="一系列的信息描述，很短同样也可以带标点。"
          actions={
            <Button type="primary" onClick={this.handleDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    if(!initDetailData){
      return '';
    }
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    //   form.setFieldsValue(current);
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="用户名" {...this.formLayout}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
            initialValue: initDetailData.userName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="用户编码" {...this.formLayout}>
          {getFieldDecorator('userCode', {
            rules: [{ required: true, message: '请输入用户编码' }],
            initialValue: initDetailData.userCode,
          })(<Input placeholder="请输入" />)}
        </FormItem>

        {/* {!current ? 
        <FormItem label='密码' hasFeedback {...this.formLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input.Password />)}
        </FormItem>
        :''} */}

        <FormItem label="手机号码" {...this.formLayout}>
          {getFieldDecorator('mobileNo', {
            rules: [{ required: true, message: '请输入手机号码' }],
            initialValue: initDetailData.mobileNo,
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label='状态' {...this.formLayout}>
          {getFieldDecorator('status', {
            rules: [{ required: true, message: '请选择状态' }],
            initialValue: initDetailData.status,
          })(
            <Select placeholder="请选择状态">
              <Option value="1">正常</Option>
              <Option value="2">锁定</Option>
              <Option value="3">停用</Option>
              <Option value="4">注销</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [{ message: '请输入至少五个字符的备注述！', min: 5 }],
            initialValue: initDetailData.remark,
          })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
        </FormItem>
      </Form>
    );
  };


  render() {
    const { pageData, loading, initDetailData } = this.props;

    console.log("明细数据：" +  JSON.stringify(initDetailData))
    const { selectedRows, modalVisible, modalDone, current = {} } = this.state;

    const modalContent = this.getModalContent(modalDone, initDetailData);


    // 窗口关闭后去除onOk方法
    const modalFooter = modalDone
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };


    const parentMethods = {
      refreshTable: this.refreshTable,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderSimpleForm()}</div> */}
            <div className={styles.tableListForm}><SearchForm {...parentMethods} /></div>

            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  /* eslint-disable */
                  this.addBtn = findDOMNode(component);
                  /* eslint-enable */
                }}
              >
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span>
              )}
            </div>
            <StandardTable
              bordered={true}
              loading={loading}
              selectedRows={selectedRows}
              columns={this.columns}
              rowKey={'userId'}
              data={pageData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title={modalDone ? null : `用户${current.userId ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={modalDone ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={modalVisible}
          {...modalFooter}
        >
          {modalContent}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default SystemUser;
