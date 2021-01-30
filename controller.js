const { validateOuterObject, validateRuleObject, finalValidation } = require("./validate");

const validationRule = (req, res) => {
  const { rule, data } = req.body;
  const dataObject = { rule, data };
  const validateRootObject = validateOuterObject(req.body);
  console.log({validateRootObject});
  if (validateRootObject !== true) {
    return res.status(400).send({
      message: validateRootObject,
      status: "error",
      data: null
    })
  }
  const secondValidation = validateRuleObject(dataObject);
  console.log({secondValidation});
  if (secondValidation !== true) {
    return res.status(400).send({
      message: secondValidation,
      status: "error",
      data: null
    })
  }
  const fieldProperties = rule.field.split(".");

  console.log({fieldProperties: fieldProperties[0]});

  const lastValidation = finalValidation(dataObject);
  console.log({lastValidation});
  if (lastValidation === false) {
    if (rule.condition === "contains") {
      return res.status(400).send({
        message: "field 5 is missing from data.",
        status: "error",
        data: null
      })
    } else {
      console.log(data[fieldProperties[0]]);
      return res.status(400).send({
        message: `field ${rule.field} failed validation.`,
        status: "error",
        data: {
          validation: {
            error: true,
            field: rule.field,
            field_value: fieldProperties.length < 2 ? data[fieldProperties[0]] : data[fieldProperties[0]][fieldProperties[1]],
            condition: rule.condition,
            condition_value: rule.condition_value
          }
        }
      })
    }
  }
  return res.status(200).send({
    message: `field ${rule.field} successfully validated.`,
    status: "success",
    data: {
      validation: {
        error: false,
        field: rule.field,
        field_value: fieldProperties.length < 1 ? data[fieldProperties[0]] : data[fieldProperties[0]][fieldProperties[1]],
        condition: rule.condition,
        condition_value: rule.condition_value
      }
    }
  })
};

module.exports = {
  validationRule
}