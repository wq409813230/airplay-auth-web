const modules = require('../public/modules');
const systemctl = modules.systemctl;
module.exports = {
    getPageList: ({ dictCode = '', dictName = '', lockStatus = '', sidx = '', sort = '', start = 0, length = 15 }) => {
        return `${systemctl}/1/dictionary/page?dictCode=${dictCode}&dictName=${dictName}&lockStatus=${lockStatus}&sidx=${sidx}&sort=${sort}&start=${start}&length=${length}`;
    },
    checkDictCodeAvailable: ({ dictCode }) => `${systemctl}/1/dictionary/${dictCode}/available?dictCode=${dictCode}`,
    createOrDelete: () => `${systemctl}/1/dictionary`,
    updateOrGetInfo: ({ code }) => `${systemctl}/1/dictionary/${code}`,
    getDicValPageList: ({ dictCode = '', lockStatus = '', sidx = '', sort = '', start = 0, length = 15 }) => {
        return `${systemctl}/1/dictionary/${dictCode}/entries/page?
            dictCode=${dictCode}&lockStatus=${lockStatus}&sidx=${sidx}&sort=${sort}&start=${start}&length=${length}`;
    },
    createDictVal: ({ dictCode }) => `${systemctl}/1/dictionary/${dictCode}/entry`,
    updateDictVal: ({ dictCode, entryKey }) => `${systemctl}/1/dictionary/${dictCode}/entry/${entryKey}`,
    getDictVal: ({ dictCode }) => `${systemctl}/1/dictionary/${dictCode}/entries`,
    deleteDictVal: ({ dictCode }) => `${systemctl}/1/dictionary/${dictCode}/entries`,
    getDicValByKey: ({ dictCode, key }) => `${systemctl}/1/dictionary/${dictCode}/entry/${key}?agencyCode=SUPER_ADMIN`,
    changeDictValStatus: ({ dictCode, entryKey }) => `${systemctl}/1/dictionary/${dictCode}/entry/${entryKey}/lockStatus`,
    checkEntryKeyAvailable: ({ dictCode, entryKey, agency }) => `${systemctl}/1/dictionary/${dictCode}/entry/${entryKey}/available?agencyCode=${agency}`,
};