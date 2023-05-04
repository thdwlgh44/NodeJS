const User = require('./user');

describe('User 모델', () => {
    test('static initiate 메서드 호출', () => {
        expect(User.initiate(sequelize).toBe(undefined));
    })
})