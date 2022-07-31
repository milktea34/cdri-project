import axios from "axios";

const naverAuthHeader:any = {
    'X-Naver-Client-Id': 'spT7e4fr9Fv0p2YvkrOX',
    'X-Naver-Client-Secret': 'TlD7RpKb9p'
}

export async function getBookList(query: string, start: number) {
    let url = '/api/v1/search/book.json?query=' + query;
    const response = await axios.get(url, {
        headers: naverAuthHeader,
        params: {start: (start-1) * 10 + 1}
    })
    return response.data;
}

export async function getBookListDetail(query: string, start: number) {
    let url = '/api/v1/search/book_adv.json?' + query;
    const response = await axios.get(url, {
        headers: naverAuthHeader,
        params: {start: (start-1) * 10 + 1}
    })
    return response.data;
}
