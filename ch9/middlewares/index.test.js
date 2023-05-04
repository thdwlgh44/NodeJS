const { isLoggedIn, isNotLoggedIn } = require('./');

describe('isLoggedIn', () => {
    test('로그인 되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1)
    });

    test('로그인 되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        const next = jest.fn();
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
})

describe('isNotLoggedIn', () => {
    test('로그인 되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const res = {
            redirect: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const next = jest.fn();
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인 한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });

    test('로그인 되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        const next = jest.fn();
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1)
    });
})