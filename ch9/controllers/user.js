const User = require('../models/user');
const follow = require('../services/user');

exports.follow = async (req, res, next) => {
    //req.user.id, req.params.id
    try {
        const result = await this.follow(req.user.id, req.params.id);
        const user = await User.findOne({ where: { id: req.user.id }});
        if (result === 'ok') {
            res.send('success');
        } else if (result === 'no user') {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}