import { ErrorOffice, ErrorOfficeBildirim } from "../../../models/index.js";

export default async ({ officeList, raporType }) => {
    try {
        if (officeList.length <= 0) {
            return false;
        }

        const promiseList = [];
        const length = officeList.length;
        console.log(["ERROR OFFİCE", length])
        for (let i = 0; i < length; i++) {
            const office = officeList[i];
            // console.log(office);
            const query = {
                companyCode: office.companyCode,
                officeCode: office.officeCode,
            }

            const upsertData = office
            if (raporType == "vizite") {
                let res = ErrorOffice.findOneAndUpdate(query, upsertData, { upsert: true }).catch((error) => {
                    console.log(['ErrorOffice.findOneAndUpdate', error]);
                });
                promiseList.push(res);
            }

            if (raporType == "bildirim") {
                let res = ErrorOfficeBildirim.findOneAndUpdate(query, upsertData, { upsert: true }).catch((error) => {
                    console.log(['ErrorOfficeBildirim.findOneAndUpdate', error]);
                });
                promiseList.push(res);
            }

        }

        while (promiseList.length) {

            await Promise.all(promiseList.splice(0, 100));
            // console.log(['promiseList', length - promiseList.length, length])
        }

        return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}