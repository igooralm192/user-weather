import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Container } from "@mantine/core";
import { Suspense } from "react";

import { queryClient } from "../App";
import { userApi } from "../api/user.api";
import { Users } from "./Users";

export function Home() {
  const { data: users } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getAll(),
  });

  const { mutateAsync: createUser, isPending: isCreating } = useMutation({
    mutationFn: ({ name, zipcode }: { name: string; zipcode: string }) =>
      userApi.create(name, zipcode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      window.dispatchEvent(new CustomEvent("user:created"));
    },
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      name,
      zipcode,
    }: {
      id: string;
      name?: string;
      zipcode?: string;
    }) => userApi.update(id, name, zipcode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      window.dispatchEvent(new CustomEvent("user:updated"));
    },
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      window.dispatchEvent(new CustomEvent("user:deleted"));
    },
  });

  const loading = isDeleting || isCreating || isUpdating;

  return (
    <Container p="md">
      <Suspense fallback={<div>Loading...</div>}>
        <Users
          users={users}
          createUser={({ name, zipcode }) => createUser({ name, zipcode })}
          updateUser={({ id, name, zipcode }) =>
            updateUser({ id, name, zipcode })
          }
          deleteUser={({ id }) => deleteUser(id)}
          loading={loading}
        />
      </Suspense>
    </Container>
  );
}
