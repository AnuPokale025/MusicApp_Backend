const Artist = require ("../modals/Artist")

const getAllArtist =async(req, res)=>{
    try{
        const artist = await Artist.find();
        res.status(200).send({
            message: "Fetch all artists",
            data : artist
        });
    }catch(err){
        return res.status(500).send({message :" Internal Server Error"})
    }
}
module.exports = {getAllArtist}