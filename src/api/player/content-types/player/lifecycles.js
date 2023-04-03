const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
    beforeCreate(event) {
        // Throwing an error will prevent the entity from being created
        if (!(event.params.data.name && event.params.data.name.trim().length > 3)) {
            throw new ApplicationError('يجب ادخال اسم لاعب صحيح');
        }
    },
};
