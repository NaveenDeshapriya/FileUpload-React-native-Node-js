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


const __filename=fileURLToPath(import.meta.url); // current file path --> C:/.../.../back-end/index.js
const __dirname=path.dirname(__filename); // get directory -->C://..../...back-end

app.use(express.json());// use json middle ware



// use multer config

const storage = multer.diskStorage({
    destination: (req, file, call) => {
        // upload path
        //assets-->image upload path

        call(null, "assets/");
    },

    filename: (req, file, call) => {

        // image filename can change use path
        call(null,file.originalname); // don't need manually -->original name--> userId.png


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



// app.use prefix  access static content

app.use("/assets",express.static(path.join(__dirname,"assets")));
app.get("/api/v1/imageView",(req,res)=>{
   const userId=req.query.id;
   // need file path image upload
   const imageFilePath=path.join(__dirname,"assets"); // path can join c:/.../../back-end/assets/

   // check image have a directory
   // fs --> node file system module
   try {
   const image= fs.readdirSync(imageFilePath).find((file)=>{ // assets directory all files get

        const imageObject=path.parse(file); // file separate

        if (imageObject) {

            if (imageObject.name==userId) { // imageObject.name -->image file name -->12345.png-->12345 equals userId
                
                return imageObject.base; //image file eka 12345.jpeg
            }

          

        }


    });

    if (image) {
        
        res.json({
            imageUrl:`${req.protocol}://${req.host}/assets/${image}`,
        });
    }else{

        res.status(404).json({
            message:"Image not found...",
        });
    }



    
   } catch (error) {
    console.error(error);
    
   }

    
})


app.listen(3000, (error) => {

    if (error) {
        console.error(error);
    } else {
        console.log("server start...")
    }

});//server start-->server port