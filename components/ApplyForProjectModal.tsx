import React, { useState } from 'react'
import Button from '@components/Button'
import Input from '@components/inputs/Input'
import { notify } from '@utils/notifications'

interface ApplyForProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

const ApplyForProjectModal: React.FC<ApplyForProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !title || !description) {
      notify({ type: 'error', message: 'Please fill in all fields' })
      return
    }

    setIsSubmitting(true)

    try {
      // Send application to backend
      const response = await fetch(
        'http://localhost:8080/api/investment-applications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            title,
            description,
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
          }),
        },
      )

      if (response.ok) {
        notify({
          type: 'success',
          message: 'Application submitted successfully!',
        })
        setEmail('')
        setTitle('')
        setDescription('')
        onClose()
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      notify({
        type: 'error',
        message: 'Failed to submit application. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bkg-1 rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-fgd-1">
              Apply for Project Listing
            </h3>
            <button
              onClick={onClose}
              className="text-fgd-3 hover:text-fgd-1 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-fgd-1 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fgd-1 mb-1">
                Project Title
              </label>
              <Input
                type="text"
                placeholder="Enter your project title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fgd-1 mb-1">
                Project Description
              </label>
              <textarea
                placeholder="Briefly describe your company and investment needs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-3 py-3 bg-bkg-2 border border-bkg-4 rounded-md text-fgd-1 placeholder-fgd-3 focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={onClose}
                className="flex-1 bg-bkg-2 text-fgd-1 hover:bg-bkg-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplyForProjectModal
