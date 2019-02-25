const modules = require('../public/modules');

const asi = modules.asi;

module.exports = {
    getColumnList: ({ agencyCode, columnCode, columnName, start, length, sidx, sort }) =>
    	 `${asi}/1/asi/columns/template/${agencyCode}/page?columnCode=${columnCode}&columnName=${columnName}&start=${start}&length=${length}&sidx=${sidx}&sort=${sort}`,
    createColumn: ({ agencyCode }) => `${asi}/1/asi/columns/template/${agencyCode}`,
    updateColumn: ({ agencyCode }) => `${asi}/1/asi/columns/template/${agencyCode}`,
    deleteColumn: ({ agencyCode, columnCode }) => `${asi}/1/asi/columns/template/${agencyCode}/${columnCode}`,
    checkColumnCodeAvailable: ({ agencyCode, columnCode }) => `${asi}/1/asi/columns/template/${agencyCode}/${columnCode}/available`,
    getDataTypes: () => `${asi}/1/asi/columns/datatypes`,
    getGroupList: ({ agencyCode, parentCode }) => `${asi}/1/asi/groups/${agencyCode}/list?parentCode=${parentCode}`,
    getGroupTree: ({ agencyCode, parentCode }) => `${asi}/1/asi/groups/${agencyCode}/tree?parentCode=${parentCode}`,
    createGroup: ({ agencyCode }) => `${asi}/1/asi/groups/${agencyCode}`,
    updateGroup: ({ agencyCode }) => `${asi}/1/asi/groups/${agencyCode}`,
    deleteGroup: ({ agencyCode, groupCode }) => `${asi}/1/asi/groups/${agencyCode}/${groupCode}`,
    getGroupColumnList: ({ agencyCode, groupCode }) => `${asi}/1/asi/columns/custom/${agencyCode}/${groupCode}`,
    copyTemplateColumn: ({ agencyCode, groupCode }) => `${asi}/1/asi/columns/custom/replication/${agencyCode}/${groupCode}`,
    createGroupColumn: ({ agencyCode, groupCode }) => `${asi}/1/asi/columns/custom/${agencyCode}/${groupCode}`,
    deleteGroupColumn: ({ agencyCode, groupCode, columnCode }) => `${asi}/1/asi/columns/custom/${agencyCode}/${groupCode}/${columnCode}`,
    checkGroupColumnAvailable: ({ agencyCode, groupCode, columnCode }) => `${asi}/1/asi/columns/custom/${agencyCode}/${groupCode}/${columnCode}/available`,
    getColumnsDefine: ({ agencyCode = 'SUPERADMIN', groupCode }) => `${asi}/1/asi/columns/custom/${agencyCode}/${groupCode}`
};
