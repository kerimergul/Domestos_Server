import { Image } from '../../../../models/index.js';

export default async (req, res) => {
    let status = true;
    try {
        let img = req.body.img;
        const image = new Image({
            data: img,
        })
        await image.save().catch((err) => {
            console.log(err);
            status = false;
        })

    } catch (error) {
        status = false;
        console.log(error);
    }
    res.send({
        status: status,
    });
    res.end();
    return;
};
