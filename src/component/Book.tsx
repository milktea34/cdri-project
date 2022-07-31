import styled from "styled-components";
import React, {useState} from "react";
import {BookProps} from "../interfaces";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";

interface BookPropType {
    book: BookProps
}

const BookItem = styled.div`
    width: 100%;
    padding: 1.5rem 0;
    border-bottom: 1px solid #D2D6DA;
`;

const SummaryRow = styled.div`
    display: flex;
    align-items: center;
`;

const DetailRow = styled(SummaryRow)`
    padding: 1.5rem 0;
    align-items: stretch;
`;

const Thumbnail = styled.img`
    width: 70px;
    height: auto;
    margin: 0 1.5rem;
    &.detail {
        width: 200px;
        height: calc(200px * 1.5);
    }
`;
const InfoWrap = styled.div`
    flex: 1 0 auto;
    &.button-row {
        max-width: 250px;
        text-align: right;
        padding-right: 1.5rem;
        &.vertical {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
        }
    }
    &.title {
        width: 45%;
        margin-right: 1.5rem;
    }
    &.price {
        text-align: center;
    }
`;
const Info = styled.span`
    &.title {
        font-weight: 700;
    }
    &.author {
        color: #8D94A0;
        font-size: 0.8rem;
        margin-left: 0.5rem;
    }
    &.price {
        font-size: 1.0rem;
        font-weight: 700;
    }
    &.detail {
        flex: 1 0 auto;
        align-self: flex-end;
        flex-direction: column-reverse;
        display: inline-flex;
        width: 100%;
    }
    & > div.pre-wrap {
        white-space: pre-wrap;
    }
`;

const DetailInfo = styled.div`
    font-size: 0.9rem;
    
    & > span.price {
        text-decoration: line-through;
        font-size: 1.2rem;
        margin-left: 0.2rem;
    }
    & > span.discount {
        font-weight: 700;
        font-size: 1.2rem;
        margin-left: 0.2rem;
    }
`;

const Button = styled.button`
    background-color: #4880EE;
    border: 0px;
    margin: 0 0.2rem;
    padding: 0.7rem 1.4rem;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    &.fill {
        width: 100%;
        margin: 2.0rem 0 0 0;
    } 
`;

const CollapseToggleButton = styled(Button)`
    background-color: #f7f7f7;
    color: #6D7582;
    display: inline-flex;
    align-items: center;
    > span {
        margin-right: 0.3rem;
    }
`;

function Book(props: BookPropType) {
    const [showDetail, setShowDetail] = useState(false);
    const onToggle = () => {
        setShowDetail(!showDetail);
    }

    const onPurchase = () => {
        window.open(props.book.link, '_blank', 'noopener,noreferrer');
    }

    return <BookItem>
        {!showDetail ? <SummaryRow>
            <Thumbnail src={props.book.image}/>
            <InfoWrap className={'title'}>
                <Info className={'title'}>{props.book.title}</Info>
                <Info className={'author'}>{props.book.author}</Info>
            </InfoWrap>
            <InfoWrap className={'price'}>
                <Info className={'price'}>{props.book.discount?.toLocaleString()}원</Info>
            </InfoWrap>
            <InfoWrap className={'button-row'}>
                <Button onClick={onPurchase}><span>구매하기</span></Button>
                <CollapseToggleButton onClick={onToggle}>
                    <span>상세보기</span>
                    <FaChevronDown color={'#B1B8C0'}></FaChevronDown>
                </CollapseToggleButton>
            </InfoWrap>
        </SummaryRow> : null}
        {showDetail ? <DetailRow>
            <Thumbnail className={'detail'} src={props.book.image}/>
            <InfoWrap className={'title'}>
                <Info className={'title'}>{props.book.title}</Info>
                <Info className={'author'}>{props.book.author}</Info>
                <Info>
                    <h4>책 소개</h4>
                    <div className={'pre-wrap'}>{props.book.description}</div>
                </Info>

            </InfoWrap>
            <InfoWrap className={'button-row vertical'}>
                <CollapseToggleButton onClick={onToggle}>
                    <span>상세보기</span>
                    <FaChevronUp color={'#B1B8C0'}></FaChevronUp>
                </CollapseToggleButton>
                <Info className={'detail'}>
                    <Button className={'fill'} onClick={onPurchase}><span>구매하기</span></Button>
                    {props.book.discount ? <DetailInfo>할인가 <span
                        className={'discount'}>{props.book.discount.toLocaleString()}원</span></DetailInfo> : null}
                    {props.book.price ? <DetailInfo>정가 <span
                        className={'price'}>{props.book.price.toLocaleString()}원</span></DetailInfo> : null}
                </Info>
            </InfoWrap>
        </DetailRow> : null}

    </BookItem>;
}

export default Book;