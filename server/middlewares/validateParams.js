import { ValidationError } from "../helpers/index.js";

export const validateParams = (validationMaps) => (req, _res, next) => {
  const checker = (rules, paramType) => {
    const params = paramType === "body" ? "body" : "params";
    if (
      req[params].constructor === Object &&
      Object.keys(req[params]).length === 0
    ) {
      throw new ValidationError(
        `Empty or missing parameters in the ${paramType}`
      );
    }

    Object.keys(req[params]).forEach((key) => {
      if (rules[key] === undefined) {
        throw new ValidationError(`Invalid parameter in the ${paramType}`);
      }

      if (typeof req[params][key] !== rules[key].type) {
        throw new ValidationError(`Invald type on parameter: ${key}`);
      }
    });

    // Check for required.
    Object.keys(rules).forEach((key) => {
      if (rules[key].required && req[params][key] === undefined) {
        throw new ValidationError(`Required parameter: ${key}`);
      }
    });
  };

  for (const validationMap of validationMaps) {
    try {
      checker(validationMap.rules, validationMap.paramType);
    } catch (err) {
      return next(err);
    }
  }

  next();
};
