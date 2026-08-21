import { Page, expect } from '@playwright/test'

export class OrderLookupPage {
    constructor(private page: Page) { }

    async validatePageLoaded() {
        await expect(this.page.getByRole('heading')).toContainText('Consultar Pedido')
    }
}
