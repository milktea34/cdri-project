function BookReducer(state: any, action: any) {
    switch (action.type) {
        case "FETCH_BOOK_LIST":
            return {
                ...state,
                bookList: [...action.value.bookList],
                totalCount: action.value.totalCount
            };
        case "UPDATE_CURSOR":
            return {
                ...state,
                cursor: action.value.cursor
            }
        case "TOGGLE_SEARCH_MODE":
            return {
                ...state,
                isDetailSearch: action.value.isDetailSearch
            }
        default:
            return state;
    }
}

export default BookReducer;