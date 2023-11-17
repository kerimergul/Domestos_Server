import { Office } from "../../../models/index.js";
const DEFAULT_LIMIT = 20;
export default async ({ companyCode, skip, limit }) => {
    if (!companyCode) {
        return false;
    }
    if (!skip && skip !== 0) {
        return false;
    }
    if (!limit) {
        limit = DEFAULT_LIMIT;
    }

    const res = await Office.find({ companyCode: companyCode, active: true }).skip(skip).limit(limit);
    if (!res) {
        console.log['res', res];
    }
    return res;
}