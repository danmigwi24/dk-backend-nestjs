import { extname } from "path"

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };
  

export const editedFileName = (req,file,callback) =>{
    const name = file.originalname.split('.')[0]
    const fileExtenstion = extname(file.originalname)
    const randomname = Array(4)
    .fill(null)
    .map(()=> Math.round(Math.random() *16).toString(16))
    .join('')

    return callback(null,`${name}-${randomname}${fileExtenstion}`)
}