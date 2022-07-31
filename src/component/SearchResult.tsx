import React from 'react';
import styled from "styled-components";
import empty_book_icon from '../icon/closed_book_icon.svg';
import Book from "./Book";
import {BookProps} from "../interfaces";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

interface BookListProps {
    list: Array<BookProps>;
    totalCount: number;
    cursor: number;
    onUpdatePageNumber: Function
}

const ResultSummaryWrap = styled.div`
    margin: 2.5rem auto 1.0rem auto;
    font-size: 0.95rem;
`;

const AccentCount = styled.span`
    color: #4880EE;
    font-weight: 500;
`;


const BookList = styled.section`
    display: flex;
    min-height: 50vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
`;

const EmptyBookIcon = styled.i`
    width: 100px;
    height: 100px;
    background: url('${empty_book_icon}');
    background-size: contain;
`;

const EmptyLabel = styled.span`
    color: darkslategray;
    margin: 2rem auto;
`;

const PaginationWrap = styled.section`
    text-align: center;
    margin: 2.0rem auto;
    display: flex;
    justify-content: center;
    gap: 0.3rem;
`;

const PaginationItem = styled.button`
    font-size: 0.8rem;
    border: 1px solid gray;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 3px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
     
    &.active {
        background-color: #4880EE;
        border-color: #4880EE;
        color: white;
    }
`

function SearchResultList(props: BookListProps) {
    return props.totalCount === 0 ? <BookList>
        <EmptyBookIcon/>
        <EmptyLabel>검색된 결과가 없습니다.</EmptyLabel>
    </BookList> : <BookList>
        {props.list.map((book, index) => <Book key={index} book={book}></Book>)}
    </BookList>;
}

interface PageProp {
    pageNumber: number,
    type: String
}


function Pagination(props: BookListProps) {
    const totalPage = Math.ceil(props.totalCount / 10);
    const pageGroup = Math.ceil(props.cursor / 10);
    const isRenderPagination = props.totalCount >= 10;

    let last = pageGroup * 10;
    if (last > totalPage) last = totalPage;
    let first = (last - (10 - 1) <= 0) ? 1 : last - (10 - 1);
    let next = last + 1;
    let prev = first - 1;
    const paginationList = [];
    if (prev > 0) {
        paginationList.push({pageNumber: prev, type: 'prev'});
    }
    for (let i = first; i <= last; i++) {
        paginationList.push({pageNumber: i, type: 'number'});
    }
    if (last < totalPage) {
        paginationList.push({pageNumber: next, type: 'next'});
    }

    const onUpdatePageNumber = (pageProp: PageProp) => {
        props.onUpdatePageNumber(pageProp.pageNumber);
    }

    return <PaginationWrap>
        {isRenderPagination ?
            paginationList.map((page: PageProp, index) => {
                if (page.type === 'prev') {
                    return <PaginationItem key={index} onClick={() => {
                        onUpdatePageNumber(page)
                    }}>
                        <AiOutlineLeft size={'0.8rem'}></AiOutlineLeft>
                    </PaginationItem>
                } else if (page.type === 'next') {
                    return <PaginationItem key={index}
                                           onClick={() => {
                                               onUpdatePageNumber(page)
                                           }}>
                        <AiOutlineRight size={'0.8rem'}></AiOutlineRight>
                    </PaginationItem>
                } else {
                    return <PaginationItem key={index}
                                           className={props.cursor === page.pageNumber ? 'active' : ''}
                                           onClick={() => {
                                               onUpdatePageNumber(page)
                                           }}>{page.pageNumber}</PaginationItem>
                }
            })
            : null}
    </PaginationWrap>
}

function SearchResult(props: BookListProps) {
    return <>
        <ResultSummaryWrap>
            도서 검색 결과 <span>총 <AccentCount>{props.totalCount}</AccentCount>건</span>
        </ResultSummaryWrap>
        <SearchResultList list={props.list} totalCount={props.totalCount} cursor={props.cursor}
                          onUpdatePageNumber={props.onUpdatePageNumber}></SearchResultList>
        <Pagination list={props.list} totalCount={props.totalCount} cursor={props.cursor}
                    onUpdatePageNumber={props.onUpdatePageNumber}></Pagination>
    </>
}

export default SearchResult;

