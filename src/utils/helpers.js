import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUserAvatarPath = (fileName) => {
  return path.join(__dirname, `../../public/uploads/avatars/${fileName}`);
};

export const getImagePath = (fileName) => {
  return path.join(__dirname, `../../public/images/${fileName}`);
};

const validateMaxArraySize = (array, maxLen) => {
  return array.length <= maxLen;
};

const removePerfImgs = (images) => {
  images.forEach((imgName) => {
    fs.unlinkSync(path.join(__dirname, `../../public/uploads/others/${imgName}`));
  });
};

export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

export const removeLocalFile = (localPaths) => {
  if (!Array.isArray(localPaths)) {
    localPaths = [localPaths];
  }

  localPaths.forEach((localPath) => {
    const path = localPath?.path || localPath;

    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) console.log("Error while removing local files: ", err);
        else {
          console.log("Removed local: ", path);
        }
      });
    }
  });
};

export const moveLocalFile = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.rename(src, dest, (err) => {
      if (err) console.log("Error while removing local files: ", err);
      else {
        console.log("Removed local: ", src);
      }
    });
  }
};

export const getUniqueFileName = (file) => {
  const uniqueFileName = `${file.originalname.split(/[;|, ]+/).shift()}-${Date.now()}.${file.originalname.split(".").pop()}`;

  return uniqueFileName;
};

export const validateFiles = (files, mimetype) => {
  files = !Array.isArray(files) ? [files] : files;

  return files.every((file) => file.mimetype.startsWith(mimetype));
};

export const validateFilesCount = (files, maxCount) => {
  return files?.length <= maxCount;
};

export const cropImage = async (file) => {
  const { width, height } = await sharp(file.buffer).metadata();

  const size = Math.min(width, height);

  file.buffer = await sharp(file.buffer).resize(size, size, { fit: sharp.fit.cover, position: sharp.strategy.attention }).webp({ quality: 20 }).toBuffer();

  return file;
};

export const saveFile = (file, name) => {
  file.filename = name;
  file.path = getLocalPath(name);

  fs.writeFile(file.path, file.buffer, (error) => {
    if (error) {
      console.log("Error while saving file: ", error);
    }

    delete file.buffer;

    console.log("File Saved: " + file.path);
  });
};

export { getUserAvatarPath, validateMaxArraySize, removePerfImgs };
