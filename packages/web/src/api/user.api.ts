import type { User } from "@shared/user";
import type { SafeResultError, SafeResultSuccess } from "@shared/safe";
import { env } from "../config/env";

export class UserApi {
  private readonly url = env.VITE_API_URL;

  async getAll(): Promise<User[]> {
    const response = await fetch(`${this.url}/users`);

    if (!response.ok) {
      const errorData = await response.json() as SafeResultError;
      throw new Error(errorData.error.message);
    }

    const data = await response.json() as SafeResultSuccess<User[]>;
    return data.data;
  }

  async create(name: string, zipcode: string): Promise<User> {
    const response = await fetch(`${this.url}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, zipcode }),
    });

    if (!response.ok) {
      const errorData = await response.json() as SafeResultError;
      throw new Error(errorData.error.message);
    }

    const data = await response.json() as SafeResultSuccess<User>;
    return data.data;
  }

  async update(id: string, name?: string, zipcode?: string): Promise<User> {
    const response = await fetch(`${this.url}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, zipcode }),
    });

    if (!response.ok) {
      const errorData = await response.json() as SafeResultError;
      throw new Error(errorData.error.message);
    }

    const data = await response.json() as SafeResultSuccess<User>;
    return data.data;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.url}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json() as SafeResultError;
      throw new Error(errorData.error.message);
    }
  }
}

export const userApi = new UserApi();
