export default ({ list }) => {
    var text = "";
    if (!list) {
        return text;
    }
    var JSESSIONID_Duplicate_Control = list.filter((c) => c.name == "JSESSIONID");
    if (JSESSIONID_Duplicate_Control.length > 1) {
        var JSESSIONID = JSESSIONID_Duplicate_Control[0];
        list = list.filter((c) => (c.name != "JSESSIONID"));
        list = list.concat(JSESSIONID);
    }
    var cookies = list;
    // console.log(cookies);


    cookies.forEach((cookie) => {
        text = `${text}${cookie.name}=${cookie.value}; `;
    });
    return text;
}