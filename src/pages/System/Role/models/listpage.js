import { queryPage,remove } from '@/services/upmsRole';
export default {
    namespace: 'System.Role',

    state: {
        gridData: [],
        pagination: {},
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryPage, payload);
            debugger
            yield put({
                type: 'save',
                payload: response,
            });
        },
        //   *add({ payload, callback }, { call, put }) {
        //     const response = yield call(addRule, payload);
        //     yield put({
        //       type: 'save',
        //       payload: response,
        //     });
        //     if (callback) callback();
        //   },
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
            debugger
            const response = yield call(remove, payload);
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
                gridData: action.payload.data,
            };
        },
    },
};
