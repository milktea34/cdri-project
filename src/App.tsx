import React, {useCallback, useReducer, useState} from 'react';
import './App.css';
import styled from 'styled-components';
import SearchResult from "./component/SearchResult";
import {BookProps, DetailQuery} from "./interfaces";
import QueryReducer, {initialQueryState} from "./reducer/QueryReducer";
import {getBookList, getBookListDetail} from "./api/BookAPI";
import BookReducer from "./reducer/BookReducer";
import SearchBar from "./component/SearchBar";

const Title = styled.h3`
      text-align: left;
      font-weight: 700;
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
    `;

const HeaderSectionWrapper = styled.section`
      padding: 1.0rem;
      background: #EAF3FE;
    `;

const SearchSectionWrapper = styled.section`
        padding: 0 1.5rem;
        text-align: left;
        max-width: 1200px;
        margin: 2.0rem auto;
        box-sizing: border-box;
    `;

const SearchTitle = styled(Title)`
    margin: 1.0rem auto;
`;


function App() {
    const initState = {
        queryList: [initialQueryState()]
    };
    const initBookState = {
        bookList: [],
        totalCount: 0,
        isDetailSearch: false,
        cursor: 1,
        keyword: ''
    };
    const [state, dispatch] = useReducer(QueryReducer, initState);
    const [bookState, bookDispatch] = useReducer(BookReducer, initBookState);
    const [isDetailPopupShow, setIsDetailPopupShow] = useState(false);

    const showDetailPopup = () => {
        setIsDetailPopupShow(true)
        bookDispatch({type: 'TOGGLE_SEARCH_MODE', value: {isDetailSearch: true}});
    }
    const closeDetailPopup = () => {
        setIsDetailPopupShow(false)
        bookDispatch({type: 'TOGGLE_SEARCH_MODE', value: {isDetailSearch: false}});
    }

    const onChangeSelect = useCallback((event: any, query: DetailQuery, index: number) => {
        query.key = event.target.value;
        dispatch({type: 'QUERY_KEY_CHANGE', value: {query: query, index: index}});
    }, []);
    const onChangeTextInput = useCallback((event: any, query: DetailQuery, index: number) => {
        query.value = event.target.value;
        dispatch({type: 'QUERY_VALUE_CHANGE', value: {query: query, index: index}});
    }, []);

    const onAddQuery = useCallback(() => {
        dispatch({type: 'ADD_QUERY', value: {query: initialQueryState()}});
    }, []);

    const onRemoveQuery = useCallback((index: number) => {
        dispatch({type: 'REMOVE_QUERY', value: {index: index}});
    }, []);

    const onResetQuery = useCallback(() => {
        dispatch({type: 'RESET_QUERY'});
    }, []);

    const onSearchKeywordEntered = useCallback((event: any) => {
        if (event.key === 'Enter') {
            bookState.keyword = event.target.value;
            dispatch({type: 'RESET_QUERY'}); // 상세검색 중지
            bookDispatch({type: 'TOGGLE_SEARCH_MODE', value: {isDetailSearch: false}});
            getBookList(bookState.keyword, 1).then((res) => {
                bookDispatch({
                    type: "FETCH_BOOK_LIST",
                    value: {
                        totalCount: res.total,
                        bookList: [...res.items.map((book: BookProps) => book)],
                        keyword: bookState.keyword
                    }
                });
            });
        }
    }, [bookState]);

    const onSearchKeywordUpdated = useCallback((event: any) => {
        bookDispatch({type: "UPDATE_KEYWORD", value: {keyword: event.target.value}});
    }, [])

    const getQueryStringFromQuery = useCallback(() => {
        return state.queryList.map((query: DetailQuery) => {
            if (query.value) {
                return [query.key, query.value].join('=')
            } else {
                return null;
            }
        }).filter((value: string) => value);
    }, [state.queryList]);

    const onSubmitDetailSearch = useCallback(() => {
        const queryParam = getQueryStringFromQuery();
        if (queryParam.length > 0) {
            closeDetailPopup()
            bookDispatch({type: 'UPDATE_KEYWORD', value: {keyword: ''}});
            bookDispatch({type: 'TOGGLE_SEARCH_MODE', value: {isDetailSearch: true}});
            getBookListDetail(queryParam.join('&'), 1).then((res) => {
                bookDispatch({
                    type: "FETCH_BOOK_LIST",
                    value: {
                        totalCount: res.total,
                        bookList: [...res.items.map((book: BookProps) => book)],
                        keyword: ''
                    }
                });
            });
        }

    }, [getQueryStringFromQuery]);


    const onUpdatePageNumber = useCallback((cursor: number) => {
        bookDispatch({type: "UPDATE_CURSOR", value: {cursor: cursor}})
        if (bookState.keyword && !bookState.isDetailSearch) {
            getBookList(bookState.keyword, cursor).then((res) => {
                window.scrollTo({top: 0})
                bookDispatch({
                    type: "FETCH_BOOK_LIST",
                    value: {
                        totalCount: res.total,
                        bookList: [...res.items.map((book: BookProps) => book)],
                        keyword: bookState.keyword
                    }
                });
            });
        } else {
            const queryParam = getQueryStringFromQuery();
            if (queryParam.length > 0) {
                getBookListDetail(queryParam.join('&'), cursor).then((res) => {
                    window.scrollTo({top: 0})
                    bookDispatch({
                        type: "FETCH_BOOK_LIST",
                        value: {
                            totalCount: res.total,
                            bookList: [...res.items.map((book: BookProps) => book)],
                            keyword: ''
                        }
                    });
                });
            }
        }
    }, [bookState.isDetailSearch, bookState.keyword, getQueryStringFromQuery]);

    return <div className="App">
        <HeaderSectionWrapper>
            <Title>
                certicos Books
            </Title>
        </HeaderSectionWrapper>
        <SearchSectionWrapper>
            <SearchTitle>
                도서 검색
            </SearchTitle>
            <SearchBar queryList={state.queryList}
                       keyword={state.keyword}
                       isDetailSearch={bookState.isDetailSearch}
                       isDetailPopupShow={isDetailPopupShow}
                       closeDetailPopup={closeDetailPopup}
                       showDetailPopup={showDetailPopup}
                       onChangeSelect={onChangeSelect}
                       onResetQuery={onResetQuery}
                       onChangeTextInput={onChangeTextInput}
                       onRemoveQuery={onRemoveQuery}
                       onSubmitDetailSearch={onSubmitDetailSearch}
                       onAddQuery={onAddQuery}
                       onSearchKeywordUpdated={onSearchKeywordUpdated}
                       onSearchKeywordEntered={onSearchKeywordEntered}></SearchBar>
            <SearchResult list={bookState.bookList} totalCount={bookState.totalCount} cursor={bookState.cursor}
                          onUpdatePageNumber={onUpdatePageNumber}></SearchResult>
        </SearchSectionWrapper>
    </div>;
}

export default App;
