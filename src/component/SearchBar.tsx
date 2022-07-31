import React, {ChangeEventHandler, KeyboardEventHandler, MouseEventHandler} from 'react';
import styled from "styled-components";
import {BiSearch, BiX} from "react-icons/bi";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
import {DetailQuery, QueryOptions} from "../interfaces";

const Wrapper = styled.div`
    display: flex;
    max-width: 100%;
`;

const SearchBarWrapper = styled(Wrapper)`
    background-color: #f7f7f7;
    padding: 0.3rem 1rem;
    border-radius: 30px;
    width: 60%;
    margin-right: 1.0rem;
    display: inline-flex;
    align-items: center;
`;
const SearchInput = styled.input`
    border: 0px;
    background-color: transparent;
    margin-left: 0.5rem;
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const DetailSearchButton = styled.button`
    margin: 0.7rem 0;
    background: white;
    border: 1px solid #818792;
    color: #818792;
    border-radius: 3px;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
`;

const Modal = styled.div`
    position: absolute;
    top: 12rem;
    left: calc(60% + 2.5rem);
    box-shadow: 1px 1px 3px 2px rgba(179,179,179,0.5);
    padding: 0.4rem;
    border-radius: 5px;
    background-color: white;
    transform: translate(-30%, 0);
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.2rem 0.5rem;
    &.close-button-row {
       justify-content: flex-end;
       padding: 0;
    }
    &.add-query {
        padding-left: 5.3rem;
        padding-right: 2.0rem;
        > button {
            width: 100%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4880EE;
            background-color: #EAF3FE;
            border: 0px;
            border-radius: 3px;
            padding: 0.4rem;
            font-weight: bold;
        }
    }
    &.button-wrap {
        justify-content: center;
        margin: 1.0rem auto 0.5rem auto;
    }
`;

const QuerySelect = styled.select`
    border: 0px;
    border-bottom: 1px solid gray;
    margin-right: 0.5rem;
    padding: 0.2rem 0.5rem 0.2rem 0;
    font-weight: bold;
    color: #353C49;
`;

const QueryInput = styled.input`
    border: 0px;
    border-bottom: 1px solid gray;
    height: 1.3rem;
    margin-right: 0.5rem;
    &:focus {
        outline: none;
        border-bottom: 1px solid #4880EE;
    }
    &.focus {
        border-bottom: 1px solid #4880EE;
    }
`;

const Button = styled.button`
    margin-right: 0.4rem;
    cursor: pointer;
    border: 0px;
    border-radius: 3px;
    padding: 0.5rem 1.0rem;
    font-weight: bold;
    &.search {
        background-color: #4880EE;
        color: white;
    }
    &.remove {
        background-color: transparent;
        border-radius: 50%;
        border: 1px solid #D2D5D9;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        margin: 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: space-evenly;
        > svg {
            width: 100%;
        }
    }
`;


interface DetailQueryProps {
    queryList: Array<DetailQuery>;
    keyword: string;
    isDetailSearch: Boolean;
    onChangeSelect?: Function;
    onChangeTextInput?: Function;
    onAddQuery: MouseEventHandler;
    onRemoveQuery: Function;
    onResetQuery: MouseEventHandler;
    toggleDetailSearch: MouseEventHandler;
    onSubmitDetailSearch: MouseEventHandler;
    onSearchKeywordEntered: KeyboardEventHandler;
    onSearchKeywordUpdated: ChangeEventHandler;
}

function QueryForm(props: any) {
    return <>
        <QuerySelect value={props.query.key}
                     onChange={(event) => props.onChangeSelect(event, props.query, props.index)}>
            {props.query.optionList.map((option: QueryOptions, opIndex: number) => <option key={opIndex}
                                                                                           value={option.key}>{option.optionName}</option>)}
        </QuerySelect>
        <QueryInput type={'text'} className={props.query.value ? 'focus' : ''} value={props.query.value}
                    onChange={(event) => props.onChangeTextInput(event, props.query, props.index)}/>
        {props.index > 0 ? <Button className={'remove'}
                                   onClick={() => props.onRemoveQuery(props.index)}><AiOutlineMinus></AiOutlineMinus></Button> :
            <Button className={'remove'} style={{visibility: "hidden"}}></Button>}
    </>
}

function DetailSearchPopup(props: DetailQueryProps) {
    return <Modal>
        <Row className={'close-button-row'}><BiX size={"1.5rem"} onClick={props.toggleDetailSearch}></BiX></Row>
        {props.queryList.map((query, index) => <Row key={index}>
            <QueryForm index={index} query={query}
                       onChangeTextInput={props.onChangeTextInput}
                       onRemoveQuery={props.onRemoveQuery}
                       onChangeSelect={props.onChangeSelect}></QueryForm>
        </Row>)}

        {props.queryList.length < 3 ? <Row className={'add-query'}>
            <Button onClick={props.onAddQuery}><AiOutlinePlus strokeWidth={30}></AiOutlinePlus>&nbsp;검색 조건 추가</Button>
        </Row> : null}
        <Row className={'button-wrap'}>
            <Button onClick={props.onResetQuery}>초기화</Button><Button className={'search'}
                                                                     onClick={props.onSubmitDetailSearch}>검색하기</Button>
        </Row>
    </Modal>;
}


function SearchBar(props: DetailQueryProps) {
    return <Wrapper>
        <SearchBarWrapper>
            <BiSearch size={20} color={'#353C49'}></BiSearch>
            <SearchInput value={props.keyword} placeholder={"검색어를 입력하세요."} onChange={props.onSearchKeywordUpdated} onKeyDown={props.onSearchKeywordEntered}></SearchInput>
        </SearchBarWrapper>
        <DetailSearchButton onClick={props.toggleDetailSearch}>상세검색</DetailSearchButton>
        {props.isDetailSearch ? <DetailSearchPopup queryList={props.queryList}
                                                   keyword={props.keyword}
                                                   isDetailSearch={props.isDetailSearch}
                                                   toggleDetailSearch={props.toggleDetailSearch}
                                                   onChangeSelect={props.onChangeSelect}
                                                   onResetQuery={props.onResetQuery}
                                                   onChangeTextInput={props.onChangeTextInput}
                                                   onRemoveQuery={props.onRemoveQuery}
                                                   onSubmitDetailSearch={props.onSubmitDetailSearch}
                                                   onAddQuery={props.onAddQuery}
                                                   onSearchKeywordUpdated={props.onSearchKeywordUpdated}
                                                   onSearchKeywordEntered={props.onSearchKeywordEntered}></DetailSearchPopup> : null}
    </Wrapper>;
}

export default SearchBar;