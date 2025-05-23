import type { Product, User } from '@/payload-types'
import type { PayloadHandler } from 'payload'

import { addDataAndFileToRequest } from 'payload'
import Stripe from 'stripe'

import type { CartItems } from '@/payload-types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

// this endpoint creates an `Invoice` with the items in the cart
// to do this, we loop through the items in the cart and lookup the product in Stripe
// we then add the price of the product to the total
// once completed, we pass the `client_secret` of the `PaymentIntent` back to the client which can process the payment
export const createPaymentIntent: PayloadHandler = async (req) => {
  const { payload, user } = req

  await addDataAndFileToRequest(req)

  console.log({ data: req.data })

  const amountFromRequest = req.data?.amount
  const emailFromRequest = req.data?.email

  if (!user && !emailFromRequest) {
    return Response.json('A user or an email is required for this transaction.', { status: 401 })
  }

  let fullUser: User | undefined

  if (user) {
    fullUser = await payload.findByID({
      id: user?.id,
      collection: 'users',
    })
  }

  if (!amountFromRequest) {
    return Response.json({ error: 'Please provide an amount.' }, { status: 401 })
  }

  try {
    let stripeCustomerID = fullUser?.stripeCustomerID
    let stripeCustomer: Stripe.Customer | undefined

    // If the user is logged in and has a Stripe Customer ID, use that
    if (fullUser) {
      if (!stripeCustomerID) {
        // lookup user in Stripe and create one if not found

        const customer = (
          await stripe.customers.list({
            email: fullUser.email,
          })
        ).data?.[0]

        // Create a new customer if one is not found
        if (!customer) {
          // lookup user in Stripe and create one if not found
          const customer = await stripe.customers.create({
            name: fullUser?.name || fullUser.email,
            email: fullUser.email,
          })

          stripeCustomerID = customer.id
        } else {
          stripeCustomerID = customer.id
        }

        if (user?.id)
          await payload.update({
            id: user.id,
            collection: 'users',
            data: {
              stripeCustomerID,
            },
          })
      }
      // Otherwise use the email from the request to lookup the user in Stripe
    } else {
      // lookup user in Stripe and create one if not found
      const customer = (
        await stripe.customers.list({
          email: emailFromRequest as string,
        })
      ).data?.[0]

      // Create a new customer if one is not found
      if (!customer) {
        const customer = await stripe.customers.create({
          email: emailFromRequest as string,
        })

        stripeCustomer = customer
        stripeCustomerID = customer.id
      } else {
        stripeCustomer = customer
        stripeCustomerID = customer.id
      }
    }

    const total = amountFromRequest

    if (total === 0) {
      throw new Error('There is nothing to pay for, add some items to your cart and try again.')
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      customer: stripeCustomerID,
      payment_method_types: ['card'],
    })

    return Response.json({ client_secret: paymentIntent.client_secret }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)

    return Response.json({ error: message }, { status: 401 })
  }
}
