import { queryDictPage, removeDict,addDict,updateDict } from '@/services/systemApi';
export default {
    namespace: 'System.Dict',

    state: {
        gridData: [],
        pagination: {},
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryDictPage, payload);
            const data = response.data;
            const result = {
                list: data.rows || [],
                pagination: {
                    total: parseInt(data.total),
                    pageSize: parseInt(data.size),
                    current: parseInt(data.current)
                },
            };

            yield put({
                type: 'save',
                payload: result,
            });
        },
        *add({ payload, callback }, { call, put }) {
            const response = yield call(addDict, payload);
            yield put({
                type: 'save',
                payload:response,
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
            debugger
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
                data: action.payload,
            };
        },
    },
};
