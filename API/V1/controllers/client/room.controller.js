const Rooms = require("../../models/rooms.model")
module.exports.index = async (req, res) => {

    try {
        const {
      
            keyword = null,
            limit = 15,
            page = 1,
            sortkey = "position",
            sortvalue = "asc",
          } = req.query;
          const find = {
            deleted: false,
          };
      
        
          if (keyword) {
            const title = new RegExp(keyword, "i");
            find.nameRoom = title;
          }
          const allRooms = await Rooms.countDocuments(find);
      
          const sort = {};
          if (sortkey && sortvalue) {
            sort[sortkey] = sortvalue;
          } else {
            sort.position = "asc";
          }
      
          const data = await Rooms.find(find)
            .limit(parseInt(limit))
            .skip((page - 1) * parseInt(limit))
            .sort(sort);
          // console.log(req.admin);
          res.status(200).json({
            message: "Truy cap du lieu thanh cong!",
            code: 200,
            data: data,
            pagination: {
              total: allRooms,
              page: parseInt(page),
              limit: parseInt(limit),
            },
          });
    } catch (error) {
        return res.status(500).json({
            message: message.error,
             code: 500
        })
    }
}