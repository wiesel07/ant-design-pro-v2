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



const SearchForm = Form.create()(props => {
  const { refreshTable, form } = props;
  const {getFieldDecorator} = form;

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
    <Form  layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="规则名称">
            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="使用状态">
            {getFieldDecorator('status')(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="0">关闭</Option>
                <Option value="1">运行中</Option>
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
    loading: state.loading.models[modelName],
  };
})
@Form.create()
class SystemUser extends React.Component {
  state = {
    selectedRows: [],
    modalDone: false,
    modalVisible: false,
    formValues: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '用户编码',
      dataIndex: 'userCode',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={e => {
            e.preventDefault();
            this.showEditModal( record)
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

  componentWillMount() {
    this.refreshTable();
  }

  // 表格数据刷新
  refreshTable = (searchFormValues) => {

  console.log(searchFormValues+"测试")
    const { dispatch } = this.props;
    dispatch({
      type: `${modelName}/queryPage`,
      payload: { searchFormValues  },
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
    this.setState({
      modalVisible: true,
      current: item,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  // handleFormReset = () => {
  //   const { form, dispatch } = this.props;
  //   form.resetFields();
  //   this.setState({
  //     formValues: {},
  //   });
  //   // 表格刷新
  //   this.refreshTable();
  // };

  // handleSearch = () => {
  //  // e.preventDefault();

  //   const { dispatch, form } = this.props;

  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;

  //     console.log(fieldsValue);
  //     const values = {
  //       ...fieldsValue,
  //     };

  //     this.setState({
  //       formValues: values,
  //     });

  //     // dispatch({
  //     //   type: 'rule/fetch',
  //     //   payload: values,
  //     // });
  //   });
  // };

  // renderSimpleForm() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="规则名称">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status')(
  //               <Select placeholder="请选择" style={{ width: '100%' }}>
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <span className={styles.submitButtons}>
  //             <Button type="primary" htmlType="submit">
  //               查询
  //             </Button>
  //             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //               重置
  //             </Button>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }


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
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        modalDone: true,
      });
      // dispatch({
      //   type: 'list/submit',
      //   payload: { id, ...fieldsValue },
      // });
    });
  };

  getModalContent = (modalDone,current) => {
    const { form: { getFieldDecorator },} = this.props;
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
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="用户名" {...this.formLayout}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
            initialValue: current.userName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="用户编码" {...this.formLayout}>
          {getFieldDecorator('userCode', {
            rules: [{ required: true, message: '请输入用户编码' }],
            initialValue: current.userCode,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [{ message: '请输入至少五个字符的备注述！', min: 5 }],
            initialValue: current.remark?current.remark:'aaaaaaaaaaaaaaaaaa',
          })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
        </FormItem>
      </Form>
    );
  };


  render() {
    const { pageData, loading , } = this.props;

    const { selectedRows, modalVisible, modalDone, current = {} } = this.state;
    
    const modalContent =this.getModalContent(modalDone,current);


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
              rowKey={'userId'}
              data={pageData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title={modalDone ? null : `任务${current.id ? '编辑' : '添加'}`}
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
