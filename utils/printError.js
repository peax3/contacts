// console log error only in development
const printError = (error) => {
  if (process.env.ENVIRONMENT === "dev") {
    console.log(error);
  }
};

module.exports = printError;
