import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "DropVault"
const OWNER_EMAIL = Deno.env.get("OWNER_NOTIFICATION_EMAIL") || ""

interface Props {
  name?: string
  email?: string
  plan?: string
  details?: string
}

const ServiceRequestNotificationEmail = ({ name, email, plan, details }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New service request from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 New Website Request</Heading>
        <Section style={infoBox}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || 'Not provided'}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>
          <Text style={label}>Plan</Text>
          <Text style={value}>{plan || 'Not specified'}</Text>
          <Text style={label}>Details</Text>
          <Text style={value}>{details || 'No details provided'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>This is an automated notification from {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ServiceRequestNotificationEmail,
  subject: (data: Record<string, any>) => `New service request from ${data.name || 'a visitor'}`,
  displayName: 'Service request notification (admin)',
  previewData: { name: 'Jane Doe', email: 'jane@example.com', plan: 'Business', details: 'I need a portfolio website with 3 pages.' },
  to: OWNER_EMAIL,
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '700', color: '#0a0a1a', margin: '0 0 20px', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const infoBox = { backgroundColor: '#f4f4f8', borderRadius: '12px', padding: '16px 20px', margin: '0 0 20px' }
const label = { fontSize: '12px', fontWeight: '600', color: '#888899', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 2px' }
const value = { fontSize: '15px', color: '#1a1a2e', margin: '0 0 4px', lineHeight: '1.5' }
const hr = { borderColor: '#e0e0e8', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
