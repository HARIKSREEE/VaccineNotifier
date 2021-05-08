const axios = require("axios").default;



const axiosHelper = {
  get: async (url,options) => {
    return await axios.get(url,options);
  },
};


module.exports = axiosHelper;