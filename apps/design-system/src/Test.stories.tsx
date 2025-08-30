import type { Meta, StoryObj } from '@storybook/react-vite'

import { Test } from '@electroaudiogram/ui'

const meta = {
  title: 'Test',
  component: Test,
  tags: ['autodocs'],
} satisfies Meta<typeof Test>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
