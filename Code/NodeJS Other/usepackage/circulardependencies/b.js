var a = require('./a');
console.log(a);

module.exports = {
    getThisName : function() {
        return "moduleB";
    },
    getOtherModuleName : function() {
        return a.name();
    }
}