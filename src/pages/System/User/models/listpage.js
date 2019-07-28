import { queryUserPage, removeUser, addUser, updateUser, getUserDetail } from '@/services/systemApi';
export default {
  namespace: 'System.User',

  state: {
    pageData: {},
    // pagination: {},
  },

  effects: {
    *queryPage({ payload }, { call, put }) {
      const response = yield call(queryUserPage, payload);
      const data = response.data;
      const result = {
        list: data.rows || [],
        pagination: {
          total: parseInt(data.total),
          pageSize: parseInt(data.pageSize),
          current: parseInt(data.current)
        },
      };

      // const result = {
      //   list: [{'userId':1,'userName':'张三','userCode':'ZS'}],
      //   pagination: {
      //     total: 1,
      //     pageSize: 10,
      //     current: 1,
      //   },
      // };

      yield put({
        type: 'save',
        payload: { pageData: result },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *detail({ payload, callback }, { call, put }) {
      const response = yield call(getUserDetail, payload);
      yield put({
        type: 'save',
        payload: { initDetailData: response.data },
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
