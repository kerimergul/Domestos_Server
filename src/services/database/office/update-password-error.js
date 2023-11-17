import { Office } from "../../../models/index.js";

export default async ({ officeList, set }) => {
    if (officeList.length <= 0) {
        return false;
    }

    const promiseList = [];
    const length = officeList.length;
    console.log(["UPDATE PASSWORD ERROR", length])
    for (let i = 0; i < length; i++) {
        const office = officeList[i];
        const query = {
            companyCode: office.companyCode,
            officeCode: office.officeCode,
        }

        let res = Office.updateOne(query, { passwordError: set }).catch((error) => {
            console.log(['Office.updateOne password error', error]);
        });
        promiseList.push(res);
    }

    while (promiseList.length) {

        await Promise.all(promiseList.splice(0, 100));
        // console.log(['promiseList', length - promiseList.length, length])
    }

    return true;
}