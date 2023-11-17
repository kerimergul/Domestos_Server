
export default async (counter) => {
    const DEMO_OFFICE = {
        name: "TEST",
        username: "21433731576",
        officeCode: "365",
        systemPass: "1999941",
        officePass: "1999941",
    }

    // ///////////////////////
    // const DEMO_LIST = [{
    //     name: "1",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "2",
    //     username: "10195413554",
    //     officeCode: "230",
    //     systemPass: "121112",
    //     officePass: "121112"
    // },
    // {
    //     name: "3",
    //     username: "10195413554",
    //     officeCode: "11",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "4",
    //     username: "10195413554",
    //     officeCode: "169",
    //     systemPass: "1999911",
    //     officePass: "1999911"
    // }, {
    //     name: "5",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "6",
    //     username: "10195413554",
    //     officeCode: "86",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "7",
    //     username: "10195413554",
    //     officeCode: "082",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "8",
    //     username: "10195413554",
    //     officeCode: "85",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "9",
    //     username: "10195413554",
    //     officeCode: "137",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "10",
    //     username: "10195413554",
    //     officeCode: "312",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "1",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "2",
    //     username: "10195413554",
    //     officeCode: "230",
    //     systemPass: "121112",
    //     officePass: "121112"
    // },
    // {
    //     name: "3",
    //     username: "10195413554",
    //     officeCode: "11",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "4",
    //     username: "10195413554",
    //     officeCode: "169",
    //     systemPass: "1999911",
    //     officePass: "1999911"
    // }, {
    //     name: "5",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "6",
    //     username: "10195413554",
    //     officeCode: "86",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "7",
    //     username: "10195413554",
    //     officeCode: "082",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "8",
    //     username: "10195413554",
    //     officeCode: "85",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "9",
    //     username: "10195413554",
    //     officeCode: "137",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "10",
    //     username: "10195413554",
    //     officeCode: "312",
    //     systemPass: "121112",
    //     officePass: "121112"
    // },
    // {
    //     name: "1",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "2",
    //     username: "10195413554",
    //     officeCode: "230",
    //     systemPass: "121112",
    //     officePass: "121112"
    // },
    // {
    //     name: "3",
    //     username: "10195413554",
    //     officeCode: "11",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "4",
    //     username: "10195413554",
    //     officeCode: "169",
    //     systemPass: "1999911",
    //     officePass: "1999911"
    // }, {
    //     name: "5",
    //     username: "21433731576",
    //     officeCode: "365",
    //     systemPass: "1999941",
    //     officePass: "1999941"
    // }, {
    //     name: "6",
    //     username: "10195413554",
    //     officeCode: "86",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "7",
    //     username: "10195413554",
    //     officeCode: "082",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "8",
    //     username: "10195413554",
    //     officeCode: "85",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "9",
    //     username: "10195413554",
    //     officeCode: "137",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }, {
    //     name: "10",
    //     username: "10195413554",
    //     officeCode: "312",
    //     systemPass: "121112",
    //     officePass: "121112"
    // }];
    ///////////////////////
    var DEMO_LIST = [];

    for (let i = 0; i < counter; i++) {
        DEMO_LIST.push(DEMO_OFFICE);
    }
    return DEMO_LIST;
}