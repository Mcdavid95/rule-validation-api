const validateOuterObject = (dataObject) => {
  const objectKeys = Object.keys(dataObject);
  if (!objectKeys.includes("rule")) {
    return "rule is required.";
  }
  if (!objectKeys.includes("data")) {
    return "data is required.";
  }
  if (typeof dataObject.rule !== "object" && !Array.isArray(dataObject.rule)) {
    return "rule should be an object.";
  }
  if (dataObject.rule) {
    try {
      JSON.stringify(dataObject.rule);
    } catch (e) {
      console.log(e);
      return "Invalid JSON payload passed.";
    }
  }
  return true;
};

const validateRuleObject = (dataObject) => {
  const ruleKeys = Object.keys(dataObject.rule);
  if (!ruleKeys.includes("field")) {
    return "field is required.";
  }
  if (!ruleKeys.includes("condition")) {
    return "condition is required.";
  }
  const conditionKeys = ["eq", "neq", "gt", "gte", "contains"];
  if (!conditionKeys.includes(dataObject.rule.condition)) {
    return "condition should be one off eq, neq, gt, gte or contains.";
  }
  if (!ruleKeys.includes("condition_value")) {
    return "condition_value is required.";
  }
  return true
};

const finalValidation = (dataObject) => {
  const fieldProperties = dataObject.rule.field.split(".");
  if (fieldProperties.length > 2) {
    return "only two levels of nesting allowed.";
  }
  const { condition } = dataObject.rule;
  const { condition_value } = dataObject.rule;
  let result = false;
  switch (condition) {
    case "eq":
      if (fieldProperties.length > 1) {
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "eq");
        result =
          condition_value ===
          dataObject.data[fieldProperties[0]][fieldProperties[1]];
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "eq");
      } else {
        result = condition_value === dataObject.data[fieldProperties[0]];
      }
      break;
    case "neq":
      if (fieldProperties.length > 1) {
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "neq");
        result =
          condition_value !==
          dataObject.data[fieldProperties[0]][fieldProperties[1]];
      } else {
        result = condition_value !== dataObject.data[fieldProperties[0]];
      }
      break;
    case "gt":
      if (fieldProperties.length > 1) {
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "gt");
        result =
          dataObject.data[fieldProperties[0]][fieldProperties[1]] >
          condition_value;
      } else {
        result =  dataObject.data[fieldProperties[0]] > condition_value;
      }
      break;
    case "gte":
      if (fieldProperties.length > 1) {
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "gte");
        result =
          dataObject.data[fieldProperties[0]][fieldProperties[1]] >=
          condition_value;
      } else {
        result =  dataObject.data[fieldProperties[0]] >= condition_value;
      }
      break;
    case "contains":
      if (fieldProperties.length > 1) {
        console.log(dataObject.data[fieldProperties[0]][fieldProperties[1]], "cotains");
        result =
          Array.isArray(
            dataObject.data[fieldProperties[0]][fieldProperties[1]]
          ) &&
          dataObject.data[fieldProperties[0]][fieldProperties[1]].includes(
            condition_value
          );
      } else {
        result =
          Array.isArray(dataObject.data[fieldProperties[0]]) &&
          dataObject.data[fieldProperties[0]].includes(condition_value);
      }
      break;

    default:
      console.log({condition});
      break;
  }
  return result;
};

module.exports = {
  validateOuterObject,
  validateRuleObject,
  finalValidation
}
