import { test, expect } from '@playwright/test'

test('Deve consultar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  // Checkpoint 1: A página deve estar online
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  // Checkpoint 2: Acessar a página de consulta de pedido
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()

  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  await page.getByTestId('search-order-id').fill('VLO-WGILT7')

  await page.getByTestId('search-order-button').click()
  
  await expect(page.getByTestId('order-result-id')).toBeVisible()
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-WGILT7')

  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')

})