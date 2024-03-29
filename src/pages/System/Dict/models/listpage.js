import { queryDictPage, removeDict, addDict, updateDict } from '@/services/systemApi';
export default {
  namespace: 'System.Dict',

  state: {
    pageData: {},
  },

  effects: {
    *queryPage({ payload }, { call, put }) {
      const response = yield call(queryDictPage, payload);
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
      //   list: [],
      //   pagination: {
      //     total: 0,
      //     pageSize: 10,
      //     current: 1,
      //   },
      // };

      yield put({
        type: 'save',
        payload: result,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addDict, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    //   *remove({ payload, callback }, { call, put }) {
    //     const response = yield call(removeRule, payload);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //     if (callback) callback();
    //   },
    //   *update({ payload, callback }, { call, put }) {
    //     const response = yield call(updateRule, payload);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //     if (callback) callback();
    //   },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeDict, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        pageData: action.payload,
      };
    },
  },
};
