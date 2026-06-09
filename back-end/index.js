// express -->node js frame work
// multer -->middleware uploading
//path -->file path change
//nodemon-->development tool file server auto start

// create first server


import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const app = express(); // express object

app.use(express.json());// use json middle ware


//get file path

const __filename = fileURLToPath(import.meta.url); // current run file full path c:/reactnative/../back-end/index.js
const __dirname = path.dirname(__filename); // index.js ---->back-end




// use multer config

const storage = multer.diskStorage({
    destination: (req, file, call) => {
        // upload path
        //assets-->image upload path

        call(null, "assets/");
    },

    filename: (req, file, call) => {

        // image filename can change use path
        call(null, file.originalname);

    }

});


// multer object

const upload = multer({
    storage: storage,
});




app.post("/api/v1/upload", upload.single("image"), (req, res) => {

    console.log("Image upload success..");

    res.send({
        message: "Ok"
    });


}); // create api handle post request reposne


app.get("/api/v1/viewImage", (req, res) => {

    const fullpath = path.join(__dirname, "assets");
    const userID = req.query.id;

    try {

        const image = fs.readdirSync(fullpath).find(file => {

            const imageObject = path.parse(file);

            if (imageObject.name == userID) {
                return imageObject.base;

            }
            return;


        });

        if (image) {
            res.json({
                imageUrl: `${req.protocol}://${req.host}/assets/${image}`,
            });

        } else {

            res.status(404).json({
                message: "Image not found",
            });
        }


    } catch (error) {
        console.error(error);
    }

});





app.listen(3000, (error) => {

    if (error) {
        console.error(error);
    } else {
        console.log("server start...")
    }

});//server start-->server port