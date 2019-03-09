const express = require('express');
const exprApp = express();
const path = require('path');

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

exprApp.use(express.static(publicDirPath));

exprApp.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});