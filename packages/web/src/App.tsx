import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { createTheme } from "@mantine/core";
import { Notifications, showNotification } from "@mantine/notifications";
import { Home } from "./components/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { QueryCache } from "@tanstack/react-query";
import { MutationCache } from "@tanstack/react-query";
import { IconX } from "@tabler/icons-react";

function handleError(error: Error) {
  console.error(error);
  showNotification({
    title: "Error",
    message: error.message,
    color: "red",
    icon: <IconX />,
  });
}

const theme = createTheme({});
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <Home />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
