import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { createOrderLookupActions } from '../support/actions/orderLookupActions'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLookupPage } from '../support/pages/OrderLookupPage'
import type { OrderDetails } from '../support/actions/orderLookupActions'

test.describe('Consulta de Pedido', () => {

  let orderLookupPage: ReturnType<typeof createOrderLookupActions>
  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLockupLink()
    await new OrderLookupPage(page).validatePageLoaded()

    orderLookupPage = createOrderLookupActions(page)
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    const order: OrderDetails = {
      number: 'VLO-WGILT7',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Ravena Felipe',
        email: 'ravena@velo.dev',
      },
      payment: 'À Vista',
    }

    await orderLookupPage.searchOrder(order.number)

    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    const order = {
      number: 'VLO-TZFCFQ',
      status: 'REPROVADO' as const,
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Lebron James',
        email: 'james@dev.com',
      },
      payment: 'À Vista',
    }

    await orderLookupPage.searchOrder(order.number)

    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {
    const order = {
      number: 'VLO-J2UC9V',
      status: 'EM_ANALISE' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Steph Curry',
        email: 'curry@velo.dev',
      },
      payment: 'À Vista',
    }

    await orderLookupPage.searchOrder(order.number)

    await orderLookupPage.validateOrderDetails(order)
    await orderLookupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()

    await orderLookupPage.searchOrder(order)
    await orderLookupPage.validateOrderNotFound()

  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {
    const orderCode = 'XYZ-999-INVALIDO'

    await orderLookupPage.searchOrder(orderCode)
    await orderLookupPage.validateOrderNotFound()
  })
})
