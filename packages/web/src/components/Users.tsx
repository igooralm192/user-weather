import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import type { User } from "@shared/user";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";

export function Users({
  users,
  createUser,
  updateUser,
  deleteUser,
  loading,
}: {
  users: User[];
  createUser: ({
    name,
    zipcode,
  }: {
    name: string;
    zipcode: string;
  }) => Promise<User>;
  updateUser: ({
    id,
    name,
    zipcode,
  }: {
    id: string;
    name?: string;
    zipcode?: string;
  }) => Promise<User>;
  deleteUser: ({ id }: { id: string }) => Promise<void>;
  loading: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      zipcode: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      zipcode: (value) => (value.length > 0 ? null : "Zipcode is required"),
    },
  });

  const handleCreate = () => {
    setOpened(true);
    setEditing(null);
    form.reset();
  };

  const handleEdit = (user: User) => {
    setOpened(true);
    setEditing(user);
    form.setValues({
      name: user.name,
      zipcode: user.zipcode,
    });
  };

  async function handleDelete(user: User) {
    await deleteUser({ id: user.id });
  }

  async function handleCreateSubmit(values: typeof form.values) {
    return await createUser({ name: values.name, zipcode: values.zipcode });
  }

  async function handleUpdateSubmit(values: typeof form.values) {
    return await updateUser({
      id: editing!.id,
      name: values.name,
      zipcode: values.zipcode,
    });
  }

  function onUserSaved() {
    setOpened(false);
    setEditing(null);
    form.reset();
    showNotification({
      title: "User saved",
      message: "User saved successfully",
      color: "green",
      icon: <IconCheck />,
    });
  }

  function onUserDeleted() {
    showNotification({
      title: "User deleted",
      message: "User deleted successfully",
      color: "green",
      icon: <IconCheck />,
    });
  }

  useEffect(() => {
    window.addEventListener("user:created", onUserSaved);
    window.addEventListener("user:updated", onUserSaved);
    window.addEventListener("user:deleted", onUserDeleted);

    return () => {
      window.removeEventListener("user:created", onUserSaved);
      window.removeEventListener("user:updated", onUserSaved);
      window.removeEventListener("user:deleted", onUserDeleted);
    };
  }, []);

  return (
    <>
      <Flex direction="column">
        <Group justify="space-between" gap="lg">
          <Text size="xl">User Weather</Text>
          <Button onClick={handleCreate}>Add User</Button>
        </Group>

        <Space h={48} />

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Zipcode</Table.Th>
              <Table.Th>Latitude</Table.Th>
              <Table.Th>Longitude</Table.Th>
              <Table.Th>Timezone</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{user.zipcode}</Table.Td>
                <Table.Td>{user.latitude}</Table.Td>
                <Table.Td>{user.longitude}</Table.Td>
                <Table.Td>{user.timezone}</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      disabled={loading}
                      loading={loading}
                      variant="subtle"
                      onClick={() => handleEdit(user)}
                    >
                      <IconEdit />
                    </ActionIcon>
                    <ActionIcon
                      disabled={loading}
                      loading={loading}
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(user)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Flex>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Edit User" : "Add User"}
      >
        <form
          onSubmit={form.onSubmit(
            editing ? handleUpdateSubmit : handleCreateSubmit
          )}
        >
          <Stack gap={12}>
            <TextInput
              disabled={loading}
              required
              label="Name"
              placeholder="John Doe"
              {...form.getInputProps("name")}
            />

            <TextInput
              disabled={loading}
              required
              label="Zipcode"
              placeholder="12345"
              {...form.getInputProps("zipcode")}
            />
          </Stack>
          <Group justify="right" mt="md">
            <Button loading={loading} disabled={loading} type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
