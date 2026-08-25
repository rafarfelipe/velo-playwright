import { db } from './database'
import { OrderTable } from './schema'

import { OrderDetails } from '../actions/orderLookupActions'

import crypto from 'crypto'

export async function insertOrder(order: OrderTable) {
  await db.insertInto('orders').values(order).execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

