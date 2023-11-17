import fs from "fs";
export default ({ opType }) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
   

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = yyyy + "." + mm + '.' + dd;
    if (opType == "today") {
        return formattedToday;
    }

    var dateJSON = fs.readFileSync("./storage/date.txt");
    // var dateJSON = dd + '.' + mm + '.' + yyyy;
    // console.log("DATE NOW HELPER:", dateJSON);

    return dateJSON;
}