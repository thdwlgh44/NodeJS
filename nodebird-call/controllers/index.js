const axios = require('axios');

const URL = process.env.API_URL; //api서버
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        })
    } catch(error) {
        if (error.response?.status === 419) {
            delete req.session.jwt;
            return request(req, api);
        }
        return error.response;
    }
};

exports.getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.searchByHashtag = async (req, res, next) => {
    try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.renderMain = (req, res) => {
    res.render('main', { key : process.env.CLIENT_SECRET });
}

// exports.test = async (req, res,next) => {
//     try {
//         if (!req.session.jwt) {
//         const tokenResult = await axios.post('http://localhost:8002/v1/token', {
//             clientSecret: process.env.CLIENT_SECRET,
//         });
//         if (tokenResult.data?.code === 200) { //매번 token을 발급하는 것은 낭비이므로 session에 저장
//             req.session.jwt = tokenResult.data.token;
//         } else { // token 발급 실패 경우 반환 값
//             return res.status(tokenResult.data?.code).json(tokenResult.data);
//         }
//     }
//     const result = await axios.get('http://localhost:8002/v1/test', {
//         headers: { authorization: req.session.jwt }
//     });
//     return res.json(result.data);
//     } catch (error) {
//         console.error(error);
//         if (error.response?.status == 419) {
//             return res.json(error.response.data);
//         }
//         return next(error);
//     }
// }