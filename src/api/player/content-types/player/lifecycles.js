
const { YupValidationError } = require("@strapi/utils").errors;
module.exports = {
    beforeCreate(event) {
        // const { data } = event.params;
        // Throwing an error will prevent the entity from being created
        if (!(event.params.data.name && event.params.data.name.trim().length > 3)) {
            const errorMessage = {
                "inner": [
                    {
                        "name": "ValidationError", // Always set to ValidationError
                        "path": 'description', // Name of field we want to show input validation on
                        "message": 'some custom error message', // Input validation message
                    }
                ]
            };
          const globalErrorMessage = "You have some issues";
          throw new YupValidationError(errorMessage, globalErrorMessage);
        }
    },
};
