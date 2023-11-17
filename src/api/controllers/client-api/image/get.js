import { Image } from '../../../../models/index.js';
import process from "process";

export default async (req, res) => {
    let status = true;
    let list = [];   

    try {

        let usage = process.cpuUsage();
        console.log(usage)
        let skip = req.body.skip;
        const countOf = await Image.countDocuments();
        if (skip >= countOf) {
            skip = 0;
        }

        list = await Image.findOne().sort({ createdAt: -1 }).skip(skip).catch((err) => {
            console.log(err);
            status = false;
        });
    } catch (error) {
        console.log(error);
        status = false;
    }
    res.send({
        status: status,
        img: list
    });
    res.end();
    return;
};
