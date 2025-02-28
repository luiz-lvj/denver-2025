"use strict";
require('dotenv').config();
const app = require("./configs/app.config")
const PORT = process.env.port || process.env.PORT || 4003
const dalService = require("./src/dal.service");

dalService.init();

dalService.listenToEvents(process.env.BASE_SEPOLIA_WSS_URL);

app.listen(PORT, () => {
    console.log("Server started on port:", PORT)
    
    
})