import User from "../../model/user/db";
import R from "../../utils/R";

async function getInfo(id: string) {
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) throw Error("无法找到此用户");
    return R.ok(user.toJSON() as {
      id: string,
      name: string,
      avatar: string,
    })
  } catch (error) {
    return R.fail(R.SERVICE_ERR, error as Error);
  }
}

export default getInfo;