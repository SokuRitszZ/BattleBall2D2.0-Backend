import R from "../../utils/R";
import fs from 'fs';
import path from "path";
import dirStatic from "../../config/staticPath";
import User, { typeUser } from "../../model/user/db";
import { HOST, mode } from "../../config.json";
import formidable from "formidable";

async function updateAvatar(id: string, file: formidable.File) {
  try {
    const dir = path.join(dirStatic, "static", "images");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const pathNew = path.join(dir, `avatar-${id}.png`);
    fs.renameSync(file.filepath, pathNew);
    const user = await User.findOne({
      where: { id },
    });
    if (!user) throw Error("用户不存在");
    const url = `${HOST[mode]}/static/images/avatar-${id}.png`;
    if ((user.toJSON() as typeUser).avatar !== url) {
      await user.update({ avatar: url, });
      await user.save();
    }
    return R.ok({
      avatar: url,
    });
  } catch (err) {
    return R.fail(R.SERVICE_ERR, err as Error);
  }
}

export default updateAvatar;