import { test, expect } from '../support/fixtures'

import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout', () => {
  test.describe('Validações de campos obrigatórios', () => {
    let alerts: any

    test.beforeEach(async ({ page, app }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

      alerts = app.checkout.elements.alerts
    })

    test('deve validar obrigatoriedade de todos os campos em brancos', async ({ app }) => {
      await app.checkout.submit()

      // Passo 1: tudo em branco

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.email).toHaveText('Email inválido')
      await expect(alerts.phone).toHaveText('Telefone inválido')
      await expect(alerts.document).toHaveText('CPF inválido')
      await expect(alerts.store).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

    test('deve validar limite minimo dos campos Nome e Sobrenome', async ({ app }) => {
      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'rafa@teste.com',
        document: '0023231321',
        phone: '(13) 99999-9999',
      }

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Rafael',
        lastname: 'Felipe',
        email: 'felipe@.com',
        document: '0023231321',
        phone: '(13) 99999-9999',
      }

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()

      await expect(alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro para CPF inválido', async ({ app }) => {
      const customer = {
        name: 'Rafael',
        lastname: 'Felipe',
        email: 'felipe@test.com',
        document: '002323132199',
        phone: '(13) 99999-9999',
      }

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      await app.checkout.submit()
      await expect(alerts.document).toHaveText('CPF inválido')
    })

    test('deve exibir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {
      const customer = {
        name: 'Rafael',
        lastname: 'Felipe',
        email: 'felipe@test.com',
        document: '002323132199',
        phone: '(13) 99999-9999',
      }

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.terms).not.toBeChecked()

      await app.checkout.submit()

      await expect(alerts.terms).toHaveText('Aceite os termos')
    })
  })

  test.describe('Pagamento e confirmação', () => {
    test.beforeEach(async ({ app }) => {
      await app.hero.open()
    })
    test('deve criar um pedido com sucesso para pagamento à vista', async ({ app }) => {
      const customer = {
        name: 'Rafael',
        lastname: 'Felipe',
        email: 'felipe@test.com',
        document: '52998224725',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'À Vista',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Aprovado!')
    })
    test('deve aprovar automáticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ app }) => {
      const customer = {
        name: 'Kevin',
        lastname: 'Durant',
        email: 'durant@velo.dev',
        document: '88070273054',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(710)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      // await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Aprovado!')
    })
    test('deve encaminhar para análise de crédito quando o score do CPF for entre 501 e 700 no financiamento', async ({ app }) => {
      const customer = {
        name: 'Tony',
        lastname: 'Stark',
        email: 'tony@stark.com',
        document: '74690251037',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(600)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido em Análise')
    })
    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada', async ({ app }) => {
      const customer = {
        name: 'Clark',
        lastname: 'Kent',
        email: 'clark@dailyplanet.com',
        document: '77599794018',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(500)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Reprovado!')
    })
    test('deve aprovado o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%', async ({app}) => {
      const customer = {
        name: 'Bruce',
        lastname: 'Wayne',
        email: 'wayne@batman.com',
        document: '07396239079',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '20000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(450)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Aprovado!')
    })
    test('deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada mair que 50%', async ({ app }) => {
      const customer = {
        name: 'Michael',
        lastname: 'Jackson',
        email: 'jackson@gmail.com',
        document: '85527910052',
        phone: '(13) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '30000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(300)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Aprovado!')
    })

    test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ app }) => {
      const customer = {
        name: 'Diana',
        lastname: 'Prince',
        email: 'diana@themiscira.com',
        document: '11144477735',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00',
        downPayment: '10000',
      }

      await deleteOrderByEmail(customer.email)

      await app.mock.creditAnalysis(500)

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfiguration()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerlData(customer)
      await app.checkout.selectStore(customer.store)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.fillDownPayment(customer.downPayment)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.expectResult('Pedido Reprovado!')
    })
  })
})
