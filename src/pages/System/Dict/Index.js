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

import UploadFile from '@/components/UploadFile';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const modelName = 'System.Dict';
import styles from './Dict.less';
import { RegisterCommand } from 'gg-editor';

const actions = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  VIEW: 'VIEW',
};


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    // const { record, handleSave } = this.props;
    const { record } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      // handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className={styles.editableCellValueWrap}
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      // handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

@connect(state => {
  return {
    pageData: state[modelName].pageData,
    loading: state.loading.models[modelName],
  };
})
@Form.create()
class SystemDict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedRows: [],
      formValues: {},
    };

    this.fakeIndex = 0;
    this.licensesCount = 1;
    this.columns = [
      {
        title: '字典编码',
        dataIndex: 'dictCode',
        //  colSpan: 0,
      },
      {
        title: '字典名称',
        dataIndex: 'dictName',
        render: (text, record) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = record.rowSpan;
          return obj;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
      },
      {
        title: '上传',
        dataIndex: 'status',
        render: (text, record) => {
          return <UploadFile test={text} /> 
        }

      },

      {
        title: '操作',
        dataIndex: 'oper',
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
  }
  componentWillMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelName}/queryPage`,
      payload: {},
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

  showModal = () => { };

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

  //遍历子元素，并赋值纵向合并数rowSpan
  makeData = (data) => {
    if (!data) return;
    const sortResult = this.sortData(data);
    const dataSource = [];
    sortResult.forEach((item) => {
      if (item.children) {
        item.children.forEach((itemOne, indexOne) => {
          const myObj = itemOne;
          myObj.rowSpan = indexOne === 0 ? item.span : 0;
          dataSource.push(myObj);
        });
      }
    });
    return dataSource;
  }

  //去重并合并到children
  sortData = (dataArr) => {
    const orgArrRe = dataArr.map(item => ({ dictName: item.dictName }));
    const orgArr = this.uniqueObjArr(orgArrRe, 'dictName');//数组去重
    for (const childOne of orgArr) { //去重reportName合并到children，得到一共有几个不同的reportName要合并
      childOne.children = [];
      for (const childTwo of dataArr) {
        if (childOne.dictName === childTwo.dictName) { //childOne是去重的，childTwo是没去重的
          childOne.children.push(childTwo);
        }
      }
    }
    for (const every of orgArr) {
      every.span = every.children ? every.children.length : 0;
    }
    orgArr.forEach((every) => { every.span = every.children ? every.children.length : 0; });
    return orgArr;
  }

  //对象数组去重
  uniqueObjArr = (arr, fieldName) => {
    const result = [];
    const resultArr = [];
    for (const child of arr) {
      if (result.indexOf(child[fieldName]) === -1) {
        result.push(child[fieldName]);
        resultArr.push(child);
      }
    }
    return resultArr;
  }

  render() {
    const { pageData, loading } = this.props;

    const makeData = this.makeData(pageData.list);
    pageData.list = makeData;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columnsa = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          //  handleSave: this.handleSave,
        }),
      };
    });
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
              components={components}
              bordered={true}
              loading={loading}
              selectedRows={selectedRows}
              columns={columnsa}
              rowKey={'dictId'}
              data={pageData}
              pagination={false}
              rowClassName={(record, index) => {
                // const className = styles.editableRow;
                // //   const className ='editable-row';
                // return className;

              }}

              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SystemDict;
