import { test, expect, Page } from "@playwright/test";

const apiUrl = "http://localhost:8000/api";

async function setup(page: Page) {
  // Navigate to the home page before each test
  await page.goto("/");

  // Wait for the page to load and users table to be visible
  await expect(page.getByText("User Weather")).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
}

test.describe("Home", () => {
  test.beforeAll(async ({ request }) => {
    console.log("Cleaning test database...");
    await request.post(`${apiUrl}/e2e/clean`);
    console.log("Test database cleaned successfully");
  });

  test("should create a new user", async ({ page }) => {
    await setup(page);

    // Click the "Add User" button
    await page.getByRole("button", { name: "Add User" }).click();

    // Verify modal is open
    await expect(page.getByTestId("modal-form")).toBeVisible();

    // Fill in the form
    const testName = `Create User ${Date.now()}`;
    const testZipcode = "12345";

    await page.getByLabel("Name").fill(testName);
    await page.getByLabel("Zipcode").fill(testZipcode);

    // Submit the form
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for modal to close and success notification
    await expect(page.getByTestId("modal-form")).not.toBeVisible();
    await expect(page.getByText("User created successfully")).toBeVisible();

    // Verify the user appears in the table
    await expect(
      page
        .locator("tbody tr", { hasText: testName })
        .filter({ hasText: testZipcode })
    ).toBeVisible();
  });

  test("should not create a new user if zipcode does not exist", async ({
    page,
  }) => {
    await setup(page);

    // Click the "Add User" button
    await page.getByRole("button", { name: "Add User" }).click();

    // Verify modal is open
    await expect(page.getByTestId("modal-form")).toBeVisible();

    // Fill in the form
    const testName = `Test User ${Date.now()}`;
    const testZipcode = "99999";

    await page.getByLabel("Name").fill(testName);
    await page.getByLabel("Zipcode").fill(testZipcode);

    // Submit the form
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for modal to close and error notification
    await expect(page.getByTestId("modal-form")).toBeVisible();
    await expect(
      page.getByText("Weather service: city not found")
    ).toBeVisible();
  });

  test("should read and display users", async ({ page }) => {
    await setup(page);

    // First, create two users
    await page.getByRole("button", { name: "Add User" }).click();
    await page.getByLabel("Name").fill(`Read User ${Date.now()}`);
    await page.getByLabel("Zipcode").fill("12345");
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Add User" }).click();
    await page.getByLabel("Name").fill(`Read User ${Date.now()}`);
    await page.getByLabel("Zipcode").fill("12345");
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForTimeout(1000);

    // Verify the table structure is present
    await expect(
      page.getByRole("cell", { name: "Name", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Zipcode", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Latitude", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Longitude", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Timezone", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Actions", exact: true })
    ).toBeVisible();

    // Check if there are any users displayed (table body should exist)
    const tableBody = page.locator("tbody");
    await expect(tableBody).toBeVisible();

    // If there are users, verify action buttons are present
    const editButtons = page
      .getByRole("button")
      .filter({ has: page.locator('[data-icon="edit"]') });
    const deleteButtons = page
      .getByRole("button")
      .filter({ has: page.locator('[data-icon="trash"]') });

    // Count should be equal for edit and delete buttons
    const editCount = await editButtons.count();
    const deleteCount = await deleteButtons.count();
    expect(editCount).toBe(deleteCount);
  });

  test("should update an existing user", async ({ page }) => {
    await setup(page);

    // First, create a user to update
    await page.getByRole("button", { name: "Add User" }).click();

    const originalName = `Original Update User ${Date.now()}`;
    const originalZipcode = "12345";

    await page.getByLabel("Name").fill(originalName);
    await page.getByLabel("Zipcode").fill(originalZipcode);
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for creation to complete
    await page.waitForTimeout(1000); // Wait for notification to disappear

    // Verify the user exists in the table
    await expect(page.getByText(originalName)).toBeVisible();

    // Find the edit button using locator 'tbody tr' by the originalName and filtering to get button
    const editButton = page
      .locator("tbody tr")
      .filter({ hasText: originalName })
      .getByTestId("edit-button");
    await editButton.click();

    // Verify edit modal is open
    await expect(page.getByText("Edit User")).toBeVisible();

    // Update the user information
    const updatedName = `Updated User ${Date.now()}`;
    const updatedZipcode = "40202";

    await page.getByLabel("Name").clear();
    await page.getByLabel("Name").fill(updatedName);
    await page.getByLabel("Zipcode").clear();
    await page.getByLabel("Zipcode").fill(updatedZipcode);

    // Submit the update
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for update to complete
    await page.waitForTimeout(1000); // Wait for notification to disappear

    // Wait for modal to close and success notification
    await expect(page.getByText("Edit User")).not.toBeVisible();
    await expect(page.getByText("User updated successfully")).toBeVisible();

    // Verify the updated information appears in the table
    await expect(
      page
        .locator("tbody tr")
        .filter({ hasText: updatedName })
        .getByRole("cell", { name: updatedZipcode })
    ).toBeVisible();

    // Verify the original information is no longer present
    await expect(
      page
        .locator("tbody tr")
        .filter({ hasText: originalName })
        .getByRole("cell", { name: originalZipcode })
    ).not.toBeVisible();
  });

  test("should delete an existing user", async ({ page }) => {
    await setup(page);

    // First, create a user to delete
    await page.getByRole("button", { name: "Add User" }).click();

    const testName = `Delete User ${Date.now()}`;
    const testZipcode = "50309";

    await page.getByLabel("Name").fill(testName);
    await page.getByLabel("Zipcode").fill(testZipcode);
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for creation to complete
    await page.waitForTimeout(1000); // Wait for notification to disappear

    // Verify the user exists in the table
    await expect(page.getByText(testName)).toBeVisible();

    // Find and click the delete button for the created user
    const deleteButton = page
      .locator("tbody tr")
      .filter({ hasText: testName })
      .getByTestId("delete-button");
    await deleteButton.click();

    // Wait for deletion to complete and success notification
    await expect(page.getByText("User deleted successfully")).toBeVisible();

    // Verify the user is no longer in the table
    await expect(
      page
        .locator("tbody tr")
        .filter({ hasText: testName })
        .getByRole("cell", { name: testZipcode })
    ).not.toBeVisible();
  });

  test("should handle form validation", async ({ page }) => {
    await setup(page);

    // Click the "Add User" button
    await page.getByRole("button", { name: "Add User" }).click();

    // Try to submit empty form
    await page.getByRole("button", { name: "Submit" }).click();

    // Verify validation errors appear
    let isNameValid = await page
      .getByTestId("name-input")
      .evaluate((el) => el.checkValidity());
    let isZipcodeValid = await page
      .getByTestId("zipcode-input")
      .evaluate((el) => el.checkValidity());
    expect(isNameValid).toBe(false);
    expect(isZipcodeValid).toBe(false);

    // Fill only name field
    await page.getByLabel("Name").fill("Test Name");
    await page.getByRole("button", { name: "Submit" }).click();

    // Verify zipcode validation still shows
    isNameValid = await page
      .getByTestId("name-input")
      .evaluate((el) => el.checkValidity());
    isZipcodeValid = await page
      .getByTestId("zipcode-input")
      .evaluate((el) => el.checkValidity());
    expect(isNameValid).toBe(true);
    expect(isZipcodeValid).toBe(false);

    // Fill zipcode field
    await page.getByLabel("Zipcode").fill("12345");

    // Now submit should work
    await page.getByRole("button", { name: "Submit" }).click();

    // Wait for creation to complete
    await expect(page.getByText("User created successfully")).toBeVisible();
    await page.waitForTimeout(1000); // Wait for notification to disappear

    // Modal should close
    await expect(page.getByTestId("modal-form")).not.toBeVisible();
  });
});
