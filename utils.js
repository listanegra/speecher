module.exports = class Utils {

    static scramble(array) {
        return [...array].map(a => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort).map(a => a.value);
    }

    static rand(min, max) {
        return Math.floor(Math.random() * ((max + 1) - min)) + min;
    }

};