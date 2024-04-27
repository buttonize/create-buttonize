interface FormEvent {
	email: string
	discount: {
		label: string
		value: number
	}
}
export const handler = async (event: FormEvent) => {
	console.log(`Generating discount of value ${event.discount.value} for customer ${event.email}`)

	return {
		discountValuePercent: event.discount.value,
		discountCode: `${Math.random()}`.split('.')[1]
	}
}
