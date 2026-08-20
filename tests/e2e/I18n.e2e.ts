import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('English copy', () => {
    test('shows English sign-in label', async ({ page }) => {
      await page.goto('/sign-in');

      await expect(page.getByRole('link', { name: 'Sign in with SANAD' })).toBeVisible();
    });
  });
});
