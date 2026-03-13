const axios = require('axios');
axios.post('http://localhost:4000/api/v1/repositories', { name: "test", description: "", isPublic: true, initReadme: false })
  .then(res => console.log(res.data))
  .catch(err => console.error(err.code, err.message));
