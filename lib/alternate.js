module.exports = function () {
    var last = 'B';
    return function () {
        return last === 'A' ? last = 'B' : last = 'A';
    };
};
