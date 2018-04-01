module.exports = {
    getUserIdFromDB: function(username, password) {
        if (username === 'Jesus' && password === '12345') {
            return 'usr100458';
        }
        else {
            return '';
        }
    }
}