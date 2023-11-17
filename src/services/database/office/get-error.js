import { ErrorOffice, ErrorOfficeBildirim } from "../../../models/index.js";
const DEFAULT_LIMIT = 5;
export default async ({ companyCode, limit, raporType }) => {
    if (!companyCode) {
        return false;
    }

    if (!limit) {
        limit = DEFAULT_LIMIT;
    }
    let res = [];
    let ids = [];
    if (raporType == "vizite") {
        res = await ErrorOffice.find({ companyCode: companyCode }).limit(limit)
        ids = res.map((r) => r?._id);
        await ErrorOffice.deleteMany({ _id: { $in: ids } });
        if (!res) {
            console.log['res', res];
        }

    } else if (raporType == "bildirim") {
        res = await ErrorOfficeBildirim.find({ companyCode: companyCode }).limit(limit)
        ids = res.map((r) => r?._id);
        await ErrorOfficeBildirim.deleteMany({ _id: { $in: ids } });
        if (!res) {
            console.log['res', res];
        }
    }
    return res;
}