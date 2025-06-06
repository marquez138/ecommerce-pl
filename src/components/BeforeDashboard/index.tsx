import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import Link from 'next/link'
import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

export const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' with a few products and pages to jump-start your new project, then '}
          <Link href="/">visit your website </Link>
          {' to see the results.'}
        </li>
        <li>
          {'Head over to '}
          <Link
            href="https://dashboard.stripe.com/test/apikeys"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stripe to obtain your API Keys
           </Link>
          {
            '. Create a new account if needed, then copy them into your environment variables and restart your server. See the '
          }
          <Link
            href="https://github.com/payloadcms/payload/blob/main/templates/ecommerce/README.md#stripe"
            rel="noopener noreferrer"
            target="_blank"
          >
            README
           </Link>
          {' for more details.'}
        </li>
        <li>
          {/* <Link to="/admin/collections/products">Link each of your products</Link> */}
          {' to Stripe by selecting the corresponding product using the dropdown under '}
          <i>Product Details</i>.
        </li>
        <li>
          If you created this repo using Payload Cloud, head over to GitHub and clone it to your
          local machine. It will be under the <i>GitHub Scope</i> that you selected when creating
          this project.
        </li>
        <li>
          {'Modify your '}
          <Link
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            collections
           </Link>
          {' and add more '}
          <Link
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            fields
           </Link>
          {' as needed. If you are new to Payload, we also recommend you check out the '}
          <Link
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            Getting Started
           </Link>
          {' docs.'}
        </li>
        <li>
          Commit and push your changes to the repository to trigger a redeployment of your project.
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <Link
        href="https://payloadcms.com/docs/admin/components#base-component-overrides"
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
       </Link>
      , you can remove it at any time by updating your <strong>payload.config</strong>.
    </div>
  )
}
