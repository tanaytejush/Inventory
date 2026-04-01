import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogActions } from '../../components/Dialog'
import { Form, FormField, FormRow } from '../../components/Form'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { useCreateSupplier, useUpdateSupplier } from '../../hooks/useSuppliers'
import type { Supplier } from '../../types'

const schema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  contactPerson: z.string().optional(),
})

export type SupplierFormValues = z.infer<typeof schema>

interface SupplierFormProps {
  supplier?: Supplier | null
  onClose: () => void
}

export function SupplierForm({ supplier, onClose }: SupplierFormProps) {
  const isEditing = Boolean(supplier)
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: supplier?.name ?? '',
      phone: supplier?.phone ?? '',
      email: supplier?.email ?? '',
      address: supplier?.address ?? '',
      gstNumber: supplier?.gstNumber ?? '',
      panNumber: supplier?.panNumber ?? '',
      contactPerson: supplier?.contactPerson ?? '',
    },
  })

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
        gstNumber: supplier.gstNumber ?? '',
        panNumber: supplier.panNumber ?? '',
        contactPerson: supplier.contactPerson ?? '',
      })
    } else {
      reset({
        name: '',
        phone: '',
        email: '',
        address: '',
        gstNumber: '',
        panNumber: '',
        contactPerson: '',
      })
    }
  }, [supplier, reset])

  const onSubmit = async (values: SupplierFormValues) => {
    const payload = {
      name: values.name,
      phone: values.phone?.trim() || undefined,
      email: values.email?.trim() || undefined,
      address: values.address?.trim() || undefined,
      gstNumber: values.gstNumber?.trim() || undefined,
      panNumber: values.panNumber?.trim() || undefined,
      contactPerson: values.contactPerson?.trim() || undefined,
    }

    try {
      if (isEditing && supplier) {
        await updateSupplier.mutateAsync({ id: supplier.id, ...payload })
      } else {
        await createSupplier.mutateAsync({ ...payload, isActive: true })
      }
      onClose()
    } catch (error) {
      console.error('Failed to save supplier', error)
    }
  }

  const isBusy = isSubmitting || createSupplier.isPending || updateSupplier.isPending

  return (
    <Dialog
      open
      onClose={onClose}
      title={isEditing ? 'Edit Supplier' : 'Add Supplier'}
      className="max-w-xl"
    >
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField>
          <Input
            label="Supplier Name"
            placeholder="Company or individual"
            {...register('name')}
            error={errors.name?.message}
            autoFocus
          />
        </FormField>

        <FormRow>
          <Input
            label="Phone"
            placeholder="Phone number"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="GSTIN"
            placeholder="GST number"
            {...register('gstNumber')}
            error={errors.gstNumber?.message}
          />
          <Input
            label="PAN"
            placeholder="PAN number"
            {...register('panNumber')}
            error={errors.panNumber?.message}
          />
        </FormRow>

        <FormField>
          <Input
            label="Contact Person"
            placeholder="Primary contact"
            {...register('contactPerson')}
            error={errors.contactPerson?.message}
          />
        </FormField>

        <FormField>
          <Input
            label="Address"
            placeholder="Street, city, state"
            {...register('address')}
            error={errors.address?.message}
          />
        </FormField>

        <DialogActions>
          <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isBusy} disabled={isBusy}>
            {isEditing ? 'Save Changes' : 'Create Supplier'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}
