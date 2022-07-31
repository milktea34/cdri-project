import {DetailQuery, QueryOptions} from "../interfaces";

export function initialQueryState() {
    return {
        key: 'd_titl',
        value: '',
        optionList: [
            {key: 'd_titl', optionName: '제목'} as QueryOptions,
            {key: 'd_auth', optionName: '저자명'} as QueryOptions,
            {key: 'd_publ', optionName: '출판사'} as QueryOptions
        ]
    };
}

function QueryReducer(state: any, action: any) {
    switch (action.type) {
        case "QUERY_KEY_CHANGE":
        case "QUERY_VALUE_CHANGE":
            state.queryList[action.value.index] = action.value.query;
            return {
                ...state,
                queryList: [...state.queryList]
            }
        case "ADD_QUERY":
            const currentSelectedOptions = state.queryList.map((query: DetailQuery) => query.key);
            action.value.query.optionList = action.value.query.optionList.filter((option: QueryOptions) => currentSelectedOptions.indexOf(option.key) === -1);
            action.value.query.key = action.value.query.optionList[0].key;
            return {
                ...state, queryList: state.queryList.concat(action.value.query)
            }
        case "REMOVE_QUERY":
            return {
                ...state, queryList: state.queryList.filter((query: DetailQuery, index: number) => {
                    return index !== action.value.index
                })
            }
        case "RESET_QUERY":
            return {
                queryList: [initialQueryState()]
            }
        default:
            return state;
    }
}

export default QueryReducer;