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
    for (const user of Object.values(userMap)) {
      const { success, data, error } = userSchema.safeParse(user);

      if (!success) {
        return { error: error.errors };
      }

      users.push(data);
    }

    return { data: users };
  }

  async getUserById(id: string): Promise<SafeResult<User>> {
    const userRef = db.ref("users").child(id);
    const snapshot = await userRef.once("value");

    const user = snapshot.val();
    if (!user) {
      return { error: "User not found" };
    }

    const { success, data, error } = await userSchema.safeParseAsync(user);

    if (!success) {
      return { error: error.errors };
    }

    return { data: data };
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

  async updateUser(
    id: string,
    userData: Partial<Omit<User, "id">>
  ): Promise<SafeResult<User>> {
    const currentUserResponse = await this.getUserById(id);
    if ("error" in currentUserResponse) {
      return { error: currentUserResponse.error };
    }

    const { data: currentUser } = currentUserResponse;

    const updatedUser = userSchema.parse({
      id: id,
      name: userData.name || currentUser.name,
      zipcode: userData.zipcode || currentUser.zipcode,
      latitude: userData.latitude || currentUser.latitude,
      longitude: userData.longitude || currentUser.longitude,
      timezone: userData.timezone || currentUser.timezone,
    });

    const userRef = db.ref("users").child(id);
    await userRef.set(updatedUser);

    return { data: updatedUser };
  }

  async deleteUser(id: string): Promise<SafeResult<{ id: string }>> {
    const currentUserResponse = await this.getUserById(id);
    if ("error" in currentUserResponse) {
      return { error: currentUserResponse.error };
    }

    const userRef = db.ref("users").child(id);
    await userRef.remove();

    return { data: { id } };
  }
}
