const fs = require('fs');

module.exports = dir => {
    let mapUrl = {};
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for(file of files){
        const key = file.slice(0, file.lastIndexOf('.'));
        mapUrl[key] = require(dir + '/' + file);
    }
    return mapUrl;
};
