const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';

axios.defaults.headers.origin = 'http://localhost:8003';
const request = async (req, api) => {
    try {
        if (!req.session.jwt) { // 세션에 토큰이 없으면
            const tokenResult = await axios.post(`${URL}/token`, { // 웹 API로 등록
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token; // session에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        }); // API 요청
    } catch (error) {
        console.error(error);
        if (error.response.status < 500) { // 410(클라이언트키이상)이나 419(토큰만료)처럼 의도된 에러면 발생
            return error.response;
        }
        throw error;
    }
};

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET });
});

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
    }
});

// router.get('/test', async (req,res, next) => {
//     try{
//         if (!req.session.jwt) { // 세션에 토큰이 없으면
//             const tokenResult = await axios.post('http://localhost:8002/v1/token', { // 웹 API로 등록
//                 clientSecret: process.env.CLIENT_SECRET,
//             });
//             if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공, tokenResult.data는 응답 결과
//                 req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
//             } else { // 토큰 발급 실패
//                 return res.json(tokenResult.data);
//             }
//         }
//         // 발급받은 토근 테스트
//         const result = await axios.get('http://localhost:8002/v1/test', {
//             headers: { authorization: req.session.jwt },
//         });
//         return res.json(result.data);
//     } catch (error) {
//         console.error(error);
//         if (error.response.status === 419) { // 토큰 만료 시
//             return res.json(error.response.data);
//         }
//         return next(error);
//     }
// });

module.exports = router;