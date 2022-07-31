export interface BookProps {
    title: string,
    link?: string,
    image?: string,
    author?: string
    description?: string,
    publisher?: string,
    price?: number,
    discount?: number,
    pubdate?: string,
    isbn?: string
}

export interface DetailQuery {
    key: string,
    value?: string,
    optionList: Array<QueryOptions>;
}

export interface QueryOptions {
    key: string
    optionName: string
}