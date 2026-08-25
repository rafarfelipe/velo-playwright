import { test, expect } from '@playwright/test'

test.describe('Checkout - validações (CT04)', () => {
  test('deve validar obrigatoriedade e dados inválidos', async ({ page }) => {
    // Arrange
    await page.goto('/order')
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

    const submit = page.getByRole('button', { name: 'Confirmar Pedido' })
    const nome = page.getByTestId('checkout-name')
    const sobrenome = page.getByTestId('checkout-surname')
    const email = page.getByTestId('checkout-email')
    const telefone = page.getByTestId('checkout-phone')
    const cpf = page.getByTestId('checkout-cpf')
    const loja = page.getByTestId('checkout-store')
    const termos = page.getByTestId('checkout-terms')

    const nameAlert = page.locator('//label[text()="Nome"]/..//p')
    const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p')
    const emailAlert = page.locator('//label[text()="Email"]/..//p')
    const phoneAlert = page.locator('//label[text()="Telefone"]/..//p')
    const cpfAlert = page.locator('//label[text()="CPF"]/..//p')
    const storeAlert = page.locator('//label[text()="Loja para Retirada"]/..//p')
    const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p')

    // Passo 1: tudo em branco
    await submit.click()

    await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(emailAlert).toHaveText('Email inválido')
    await expect(phoneAlert).toHaveText('Telefone inválido')
    await expect(cpfAlert).toHaveText('CPF inválido')
    await expect(storeAlert).toHaveText('Selecione uma loja')
    await expect(termsAlert).toHaveText('Aceite os termos')

    // Passo 2: Nome/Sobrenome com 1 letra
    await nome.fill('A')
    await sobrenome.fill('B')
    await submit.click()
    await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')

    // Passo 3: e-mail inválido
    await nome.fill('João')
    await sobrenome.fill('Silva')
    await email.fill('cliente@.com')
    await submit.click()
    await expect(emailAlert).toHaveText('Email inválido')

    // Passo 4: CPF inválido
    await cpf.fill('123')
    await submit.click()
    await expect(cpfAlert).toHaveText('CPF inválido')

    // Passo 5: tudo correto, sem aceitar termos
    await email.fill('joao.silva@email.com')
    await telefone.fill('(11) 99999-9999')
    await cpf.fill('529.982.247-25')
    await loja.click()
    await page.getByRole('option', { name: /Velô Paulista/ }).click()
    await expect(termos).not.toBeChecked()
    await submit.click()
    await expect(termsAlert).toHaveText('Aceite os termos')
  })
})
