import React from 'react'

import './index.css'

import { type invoice } from '../../datas/invoices'

export default function Invoice(props:invoice) {
  return (
    <div className='invoice'>
        <h3>id:{props.id}</h3>
        <h3>brand:{props.brand}</h3>
        <h3>number:{props.number}</h3>
    </div>
  )
}
