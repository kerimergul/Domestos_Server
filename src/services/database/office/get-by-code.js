import { Office } from "../../../models/index.js";
export default async ({ officeCode }) => {
    if (!officeCode) {
        officeCode = [];
    }

    const res = await Office.find({ officeCode: { "$in": officeCode }, active: true }).catch((err) => {
        console.log(err);

    });
    if (!res) {
        console.log['getOfficeByCode ', res];
    }
    return res;
}