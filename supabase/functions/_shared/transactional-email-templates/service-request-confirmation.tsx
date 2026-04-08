import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "DropVault"

interface Props {
  name?: string
  plan?: string
}

const ServiceRequestConfirmationEmail = ({ name, plan }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your website request — we'll be in touch within 24 hours</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for your request!'}
        </Heading>
        <Text style={text}>
          We've received your website build request{plan && plan !== 'Not specified' ? ` for the <strong>${plan}</strong> plan` : ''} and our team will review it shortly.
        </Text>
        <Text style={text}>
          Here's what happens next:
        </Text>
        <Section style={steps}>
          <Text style={stepText}>1. We'll review your project details</Text>
          <Text style={stepText}>2. You'll receive a scope document within 24 hours</Text>
          <Text style={stepText}>3. Once approved, we'll send a formal agreement for signature</Text>
          <Text style={stepText}>4. Work begins after agreement & payment</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          If you have questions, just reply to this email. We're here to help.
        </Text>
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ServiceRequestConfirmationEmail,
  subject: "We received your website request!",
  displayName: 'Service request confirmation',
  previewData: { name: 'Jane', plan: 'Business' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#0a0a1a', margin: '0 0 20px', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const text = { fontSize: '15px', color: '#3a3a4a', lineHeight: '1.6', margin: '0 0 16px' }
const steps = { backgroundColor: '#f4f4f8', borderRadius: '12px', padding: '16px 20px', margin: '0 0 20px' }
const stepText = { fontSize: '14px', color: '#3a3a4a', lineHeight: '1.5', margin: '4px 0' }
const hr = { borderColor: '#e0e0e8', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#888899', margin: '0 0 8px' }
