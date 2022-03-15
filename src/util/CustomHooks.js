import { useState } from 'react'

export const useForm = (callbcak, intialValues) => {
  const [values, setValues] = useState(intialValues)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const submitForm = (e) => {
    e.preventDefault()
    callbcak()
  }

  return {
    values,
    onChange,
    submitForm,
  }
}
