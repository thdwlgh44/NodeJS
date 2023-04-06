const Sequelize = require('sequelize');

//개발 시 수정이 필요하다면: 테이블을 삭제하고 다시 실행시킨다.
class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatdAt
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt 유저 삭제일, soft delete: 나중에 복구할 수 있도록 하는 목적
            charset: 'utf8', //이모티콘도 넣고 싶다면 utf8mb4
            collate: 'utf8_general_ci', // 어떤 방식으로 정렬하는지
        })
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // 팔로워
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        })
        db.User.belongsToMany(db.User, { // 팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        })
    }
}

module.exports = User;