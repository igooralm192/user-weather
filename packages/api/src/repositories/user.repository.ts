import { User } from "@shared/user";

import { db } from "../config/firebase";
import { userSchema } from "../schemas";
import { SafeResult } from "@shared/safe";

export default class UserRepository {
  async getAllUsers(): Promise<SafeResult<User[]>> {
    const snapshot = await db.ref("users").once("value");

    const userMap = snapshot.val();
    if (!userMap) {
      return { data: [] };
    }
    const users: User[] = [];
    for await (const user of Object.values(userMap)) {
      const { success, data, error } = await userSchema.safeParseAsync(user);

      if (!success) {
        return { error: error.errors };
      }

      users.push(data);
    }

    return { data: users };
  }

  async createUser(userData: Omit<User, "id">): Promise<SafeResult<User>> {
    const id = crypto.randomUUID();

    const user = userSchema.parse({
      id,
      ...userData,
    });

    const userRef = db.ref("users").child(id);
    await userRef.set(user);

    return { data: user };
  }
}
