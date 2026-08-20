import { expect, test } from '@playwright/test';

test.describe('Sanity', () => {
  test.describe('Static pages', () => {
    test('should display the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: 'Integrations Module' })).toBeVisible();
    });

    test('should open the integrations hub', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Open integrations' }).click();

      await expect(page).toHaveURL(/dashboard\/?$/u);
      await expect(page.getByRole('heading', { name: 'Integrations Module' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'SANAD SSO' })).toBeVisible();
      await expect(page.getByText('Coming soon')).toBeVisible();
    });

    test('should open the SANAD SSO module', async ({ page }) => {
      await page.goto('/dashboard/integrations/sanad-sso');

      await expect(page.getByRole('heading', { name: 'SANAD SSO' })).toBeVisible();
      await expect(page.getByText('Integration details')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Sign in with SANAD' })).toBeVisible();
    });
  });
});
