import { User } from "@shared/user";

import { db } from "../config/firebase";
import { userSchema } from "../schemas";
import { SafeResult } from "@shared/safe";

export default class UserRepository {
  async getAllUsers(): Promise<SafeResult<User[]>> {
    try {
      const snapshot = await db.ref("users").once("value");

      const userMap = snapshot.val();
      if (!userMap) {
        return { data: [] };
      }

      const users: User[] = [];
      for (const user of Object.values(userMap)) {
        const { success, data, error } = userSchema.safeParse(user);

        if (!success) {
          console.error(error);
          return {
            error: {
              message: "User repository: Error on parsing user",
              status: 500,
            },
          };
        }

        users.push(data);
      }

      return { data: users };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "User repository: Internal server error",
          status: 500,
        },
      };
    }
  }

  async getUserById(id: string): Promise<SafeResult<User>> {
    try {
      const userRef = db.ref("users").child(id);
      const snapshot = await userRef.once("value");

      const user = snapshot.val();
      if (!user) {
        return { error: { message: "User not found", status: 404 } };
      }

      const { success, data, error } = await userSchema.safeParseAsync(user);

      if (!success) {
        console.error(error);
        return {
          error: {
            message: "User repository: Error on parsing user",
            status: 500,
          },
        };
      }

      return { data: data };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "User repository: Internal server error",
          status: 500,
        },
      };
    }
  }

  async createUser(userData: Omit<User, "id">): Promise<SafeResult<User>> {
    try {
      const user = { id: crypto.randomUUID(), ...userData };

      const userRef = db.ref("users").child(user.id);
      await userRef.set(user);

      return { data: user };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "User repository: Internal server error",
          status: 500,
        },
      };
    }
  }

  async updateUser(
    id: string,
    userData: Partial<Omit<User, "id">>
  ): Promise<SafeResult<User>> {
    try {
      const currentUserResponse = await this.getUserById(id);
      if ("error" in currentUserResponse) {
        return currentUserResponse;
      }

      const { data: currentUser } = currentUserResponse;

      const updatedUser = {
        id: id,
        name: userData.name || currentUser.name,
        zipcode: userData.zipcode || currentUser.zipcode,
        latitude: userData.latitude || currentUser.latitude,
        longitude: userData.longitude || currentUser.longitude,
        timezone: userData.timezone || currentUser.timezone,
      };

      const userRef = db.ref("users").child(id);
      await userRef.set(updatedUser);

      return { data: updatedUser };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "User repository: Internal server error",
          status: 500,
        },
      };
    }
  }

  async deleteUser(id: string): Promise<SafeResult<{ id: string }>> {
    try {
      const currentUserResponse = await this.getUserById(id);
      if ("error" in currentUserResponse) {
        return currentUserResponse;
      }

      const userRef = db.ref("users").child(id);
      await userRef.remove();

      return { data: { id } };
    } catch (error) {
      console.error(error);
      return {
        error: {
          message: "User repository: Internal server error",
          status: 500,
        },
      };
    }
  }
}
